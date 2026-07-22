import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, Phone, ChevronRight, LogOut, Globe } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { user, loading, signOut } = useAuth();
  const [userName, setUserName] = useState("User");
  const [userPhone, setUserPhone] = useState("");



  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("name, phone")
          .eq("user_id", user.id)
          .single();
        
        if (data?.name) {
          setUserName(data.name);
        }
        if (data?.phone) {
          setUserPhone(data.phone);
        } else if (user.phone) {
          setUserPhone(user.phone);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const languages: Record<string, string> = {
    english: "English",
    hindi: "हिन्दी (Hindi)",
    bengali: "বাংলা (Bengali)",
    gujarati: "ગુજરાતી (Gujarati)",
    tamil: "தமிழ் (Tamil)",
    telugu: "తెలుగు (Telugu)",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
        <div className="max-w-2xl mx-auto p-6 animate-fade-in">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
      <div className="max-w-2xl mx-auto p-6 space-y-8 animate-fade-in">
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>

        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">{t("personalInfo")}</h2>
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("name")}</p>
                <p className="text-foreground font-medium">{userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("phone")}</p>
                <p className="text-foreground font-medium">{userPhone || "Not Set"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">{t("language")}</h2>
          <div
            onClick={() => navigate("/language")}
            className="bg-card rounded-xl border border-border p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Globe className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("language")}</p>
                <p className="text-foreground font-medium">{languages[language]}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Sign Out */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full rounded-xl h-12 flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
