import { Mic, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-t from-primary/5 to-background pb-32">
      <div className="max-w-2xl mx-auto p-6 space-y-16 animate-fade-in flex flex-col items-start justify-start pt-32 min-h-screen">
        <div className="absolute top-6 left-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Med<span className="text-primary">Box</span>
          </h2>
        </div>
        
        <div className="space-y-2 w-full">
          <h1 className="text-5xl font-semibold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            Welcome
          </h1>
          <p className="text-base text-muted-foreground font-normal">
            Tell Us Your Medicine
          </p>
        </div>

        <div className="relative w-full flex items-center justify-center my-8">
          <div 
            onClick={() => navigate("/voice-recording")}
            className="relative w-56 h-56 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          >
            {/* Animated gradient circles - 2 circles with lighter colors */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-xl liquid-sphere"></div>
            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary/25 via-primary/15 to-primary/10 backdrop-blur-lg liquid-sphere-reverse"></div>
            
            {/* Circular outlines */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
            <div className="absolute inset-8 rounded-full border border-primary/10"></div>
            
            {/* 3D Mic Icon - filled with darkest blue */}
            <div className="relative z-10 w-16 h-16 flex items-center justify-center">
              <Mic className="w-14 h-14 fill-primary stroke-primary drop-shadow-[0_4px_8px_rgba(0,122,158,0.4)]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,122,158,0.3))' }} />
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/add-medicine")}
          className="flex items-center gap-2 text-primary font-medium hover:underline transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Your Medicine Manually</span>
        </button>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Home;
