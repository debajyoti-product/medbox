import { Bell, Search, Sun, Moon, Camera, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import CameraCapture from "@/components/CameraCapture";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import medboxLogo from "@/assets/medbox-logo-new.png";
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return {
    text: "Good Morning",
    icon: Sun
  };
  if (hour < 17) return {
    text: "Good Afternoon",
    icon: Sun
  };
  return {
    text: "Good Evening",
    icon: Moon
  };
};
const Home = () => {
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  const {
    user,
    loading
  } = useAuth();
  const [userName, setUserName] = useState("User");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signup");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const {
          data
        } = await supabase.from("profiles").select("name").eq("user_id", user.id).single();
        if (data?.name) {
          setUserName(data.name);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleCapture = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      const response = await supabase.functions.invoke('process-prescription-v2', {
        body: { imageBase64: imageData }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to process image');
      }

      const { medicines, error } = response.data;

      if (error) {
        toast({
          title: "Processing Error",
          description: error,
          variant: "destructive",
        });
        return;
      }

      if (!medicines || medicines.length === 0) {
        toast({
          title: "No medicines found",
          description: "Could not identify medicines. Please try again or add manually.",
          variant: "destructive",
        });
        navigate("/add-medicine");
        return;
      }

      // Navigate to review screen with extracted medicines
      navigate("/review-medicines", { state: { medicines } });
    } catch (error) {
      console.error("Error processing prescription:", error);
      toast({
        title: "Error",
        description: "Failed to process prescription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>;
  }
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  return <div className="h-screen bg-gradient-to-b from-background via-background to-card pb-32 overflow-hidden fixed inset-0">
      <div className="max-w-2xl mx-auto p-6 h-full animate-fade-in flex flex-col pt-6">
        <div className="w-full space-y-4">
          <div className="w-full flex items-center justify-between">
            <img src={medboxLogo} alt="MedBox Logo" className="w-16 h-16 object-contain" />
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/language")} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card hover:bg-secondary transition-colors">
                <span className="text-sm font-medium text-foreground font-caslon">{t("currentLanguage")}</span>
                <span className="text-muted-foreground">›</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-secondary transition-colors">
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

        {/* Scan prescription card - centered between header and nav */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          {/* Camera button with glassmorphic box */}
          <div className="w-full max-w-xs relative">
            <button 
              onClick={() => setIsCameraOpen(true)}
              className="relative w-full py-8 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all active:scale-[0.98]"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Camera frame with corner brackets */}
              <div className="w-32 h-24 relative flex items-center justify-center">
                {/* Top left corner */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-primary/70 rounded-tl-lg" />
                {/* Top right corner */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-primary/70 rounded-tr-lg" />
                {/* Bottom left corner */}
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-primary/70 rounded-bl-lg" />
                {/* Bottom right corner */}
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-primary/70 rounded-br-lg" />
                
                {/* Camera icon in center */}
                <Camera className="w-10 h-10 text-primary/60" />
              </div>
              
              <span className="text-muted-foreground font-medium text-sm">Tap to Scan Prescription</span>
            </button>
          </div>

          {/* Separator with "or" */}
          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-muted-foreground/50 text-xs">or</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* Search bar */}
          <div onClick={() => navigate("/search")} className="w-full max-w-xs flex items-center gap-3 px-4 py-3 h-12 bg-background rounded-full cursor-pointer hover:bg-background/80 transition-all border border-border shadow-sm">
            <Search className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Search Your Medicines Here</span>
          </div>
        </div>
      </div>
      
      <BottomNav />
      
      <CameraCapture 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={handleCapture} 
      />

      {/* Processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-foreground font-medium">Analyzing prescription...</p>
          <p className="text-muted-foreground text-sm">This may take a few seconds</p>
        </div>
      )}
    </div>;
};
export default Home;