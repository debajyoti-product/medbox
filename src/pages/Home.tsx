import { Bell, Camera, Loader2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import CameraCapture from "@/components/CameraCapture";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import medboxLogo from "@/assets/medbox-logo-new.png";
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

  const processImage = async (imageData: string) => {
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

  const handleCapture = async (imageData: string) => {
    await processImage(imageData);
  };

  const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;
      if (imageData) {
        await processImage(imageData);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>;
  }
  return <div className="h-screen bg-gradient-to-b from-background via-background to-card pb-32 overflow-hidden fixed inset-0">
      <div className="max-w-2xl mx-auto p-6 h-full animate-fade-in flex flex-col pt-6">
        <div className="w-full space-y-4">
          <div className="w-full flex items-center justify-between">
            <img src={medboxLogo} alt="MedBox Logo" className="w-16 h-16 object-contain" />
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/language")} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card hover:bg-secondary transition-colors">
                <span className="text-sm font-medium text-foreground font-sans">{t("currentLanguage")}</span>
                <span className="text-muted-foreground">›</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-secondary transition-colors">
                <Bell className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
          
        </div>

        {/* Prescription section */}
        <div className="flex-1 flex flex-col items-start justify-center gap-6 w-full mt-8">
          <h2 className="text-2xl font-bold text-foreground">
            Add Your Prescription
          </h2>

          {/* Primary Option: Camera (Large Rectangle) */}
          <div className="w-full relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 blur-xl opacity-60" />
            <button 
              onClick={() => setIsCameraOpen(true)}
              className="relative w-full aspect-[4/3] max-h-64 rounded-3xl flex flex-col items-center justify-center gap-5 transition-all active:scale-[0.98] bg-white border border-border shadow-sm hover:shadow-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <span className="text-foreground font-semibold text-lg">Take Photo</span>
            </button>
          </div>

          {/* Secondary Option: Upload (Horizontal Bar) */}
          <div className="w-full mt-2">
            <label className="relative w-full py-4 px-6 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] bg-white border border-border shadow-sm cursor-pointer hover:bg-secondary/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-foreground font-medium text-base">Upload File</span>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleGallerySelect}
              />
            </label>
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