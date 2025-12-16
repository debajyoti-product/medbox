import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const NameEntry = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signup");
    }
  }, [user, loading, navigate]);

  const handleContinue = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please Enter Your Name To Continue",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please Sign In First",
        variant: "destructive",
      });
      navigate("/signup");
      return;
    }

    setIsLoading(true);

    // Update profile with name
    const { error } = await supabase
      .from("profiles")
      .update({ name: name.trim() })
      .eq("user_id", user.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed To Save Your Name. Please Try Again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Welcome, " + name.trim() + "!",
      description: "Your Profile Has Been Set Up",
    });
    
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex flex-col p-6 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-between max-w-md w-full mx-auto">
        <div className="space-y-8 text-center w-full pt-24">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              What Should We Call You?
            </h2>
            <p className="text-muted-foreground">
              Enter Your Name So We Can Personalize Your Experience
            </p>
          </div>

          <div className="space-y-6">
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 text-lg text-center bg-transparent border-0 border-b-2 border-border rounded-none focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/40"
              style={{
                borderImage: "linear-gradient(90deg, transparent, hsl(var(--border)), transparent) 1",
              }}
            />
          </div>
        </div>

        <Button
          onClick={handleContinue}
          size="lg"
          variant="gradient"
          className="w-full text-base h-12 rounded-full font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default NameEntry;
