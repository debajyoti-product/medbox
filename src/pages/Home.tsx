import { Mic, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("medbox_username") || "User";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
      <div className="max-w-2xl mx-auto p-6 space-y-10 animate-fade-in flex flex-col items-center justify-start pt-24 min-h-screen">
        <div className="absolute top-6 left-6">
          <img 
            src="/assets/medbox-logo.png" 
            alt="MedBox Logo" 
            className="w-10 h-10"
          />
        </div>
        
        <div className="space-y-4 w-full">
          <h1 className="text-3xl font-semibold text-foreground text-left">
            Hello, {userName}
          </h1>
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border"></div>
            <p className="text-base text-muted-foreground font-normal whitespace-nowrap">
              Tell Us Your Medicine
            </p>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border"></div>
          </div>
        </div>

        <div className="relative w-full flex items-center justify-center my-4">
          <div 
            onClick={() => navigate("/voice-recording")}
            className="relative w-44 h-44 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          >
            {/* Animated gradient circles - 2 circles with lighter colors */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(350,60%,70%)]/20 via-[hsl(25,80%,65%)]/10 to-[hsl(35,40%,85%)]/10 backdrop-blur-xl liquid-sphere"></div>
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[hsl(350,60%,70%)]/30 via-[hsl(25,80%,65%)]/20 to-[hsl(35,40%,85%)]/20 backdrop-blur-lg liquid-sphere-reverse"></div>
            
            {/* Circular outlines */}
            <div className="absolute inset-0 rounded-full border-2 border-[hsl(350,60%,70%)]/30"></div>
            <div className="absolute inset-6 rounded-full border border-[hsl(25,80%,65%)]/20"></div>
            
            {/* 3D Mic Icon - filled with primary */}
            <div className="relative z-10 w-14 h-14 flex items-center justify-center">
              <Mic className="w-12 h-12 fill-[hsl(20,25%,20%)] stroke-none drop-shadow-[0_4px_8px_rgba(60,40,30,0.4)]" style={{ filter: 'drop-shadow(0 2px 4px rgba(60,40,30,0.3))' }} />
            </div>
          </div>
        </div>

        {/* Or divider */}
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border"></div>
          <span className="text-sm text-muted-foreground">Or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border"></div>
        </div>

        <Button
          onClick={() => navigate("/add-medicine")}
          className="flex items-center gap-2 font-medium rounded-full px-6 py-3 h-12 bg-card text-foreground hover:bg-card/80 transition-all"
          style={{
            background: 'linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, hsl(350, 60%, 70%), hsl(25, 80%, 65%), hsl(35, 40%, 85%)) border-box',
            border: '2px solid transparent'
          }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Your Medicine Manually</span>
        </Button>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Home;
