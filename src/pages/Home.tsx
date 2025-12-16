import { Bell, Search, Sun, Moon, ChevronsDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import medboxLogo from "@/assets/medbox-logo-new.png";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", icon: Sun };
  if (hour < 17) return { text: "Good Afternoon", icon: Sun };
  return { text: "Good Evening", icon: Moon };
};

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signup");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("name")
          .eq("user_id", user.id)
          .single();
        
        if (data?.name) {
          setUserName(data.name);
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="h-screen bg-gradient-to-b from-background via-background to-card pb-32 overflow-hidden fixed inset-0">
      <div className="max-w-2xl mx-auto p-6 h-full animate-fade-in flex flex-col pt-6">
        <div className="w-full space-y-4">
          <div className="w-full flex items-center justify-between">
            <img 
              src={medboxLogo} 
              alt="MedBox Logo" 
              className="w-16 h-16 object-contain"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/language")}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card hover:bg-secondary transition-colors"
              >
                <span className="text-sm font-medium text-foreground font-caslon">{t("currentLanguage")}</span>
                <span className="text-muted-foreground">›</span>
              </button>
              <button
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Bell className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
          
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground">{greeting.text}</span>
              <GreetingIcon className="w-4 h-4 text-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground capitalize">
              {userName}
            </h1>
          </div>
        </div>

        {/* Centered content area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-muted-foreground/40 text-sm mb-3">Add Medicines To Get Started</p>
          <ChevronsDown className="w-6 h-6 text-muted-foreground/40 animate-bounce" />
        </div>

        {/* Search bar positioned above bottom nav */}
        <div 
          onClick={() => navigate("/search")}
          className="w-full flex items-center gap-3 px-4 py-3 h-12 bg-background rounded-full cursor-pointer hover:bg-background/80 transition-all border border-border shadow-md mb-6"
        >
          <Search className="w-5 h-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Search Your Medicines Here</span>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Home;
