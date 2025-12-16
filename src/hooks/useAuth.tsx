import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  sendOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: Error | null; isNewUser: boolean }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Demo mode: Create a deterministic email from phone number for testing
  const phoneToEmail = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    return `demo_${cleanPhone}@medbox.demo`;
  };

  const sendOtp = async (phone: string) => {
    // Demo mode: Just store the phone, no actual OTP sent
    // In production, you would use supabase.auth.signInWithOtp({ phone })
    console.log("Demo mode: OTP would be sent to", phone);
    return { error: null };
  };

  const verifyOtp = async (phone: string, token: string) => {
    // Demo mode: Accept any 6-digit code and sign in with email/password
    if (token.length !== 6) {
      return { error: new Error("Please enter a 6-digit code"), isNewUser: false };
    }

    const email = phoneToEmail(phone);
    const password = `demo_password_${phone.replace(/\D/g, "")}`;

    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInData.user) {
      // Existing user - check if they have a name
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", signInData.user.id)
        .single();

      return { error: null, isNewUser: !profile?.name };
    }

    // User doesn't exist, create new account
    if (signInError?.message?.includes("Invalid login credentials")) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            phone: phone,
          },
        },
      });

      if (signUpError) {
        return { error: signUpError as Error, isNewUser: false };
      }

      // Update profile with phone number
      if (signUpData.user) {
        await supabase
          .from("profiles")
          .update({ phone: phone })
          .eq("user_id", signUpData.user.id);
      }

      return { error: null, isNewUser: true };
    }

    return { error: signInError as Error | null, isNewUser: false };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, sendOtp, verifyOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
