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
            tell us your medicine
          </p>
        </div>

        <div className="relative w-full flex items-center justify-center my-8">
          <div className="relative w-64 h-64 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            {/* Animated gradient circles */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 backdrop-blur-xl liquid-sphere"></div>
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/40 via-primary/25 to-primary/15 backdrop-blur-lg liquid-sphere-reverse"></div>
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/50 via-primary/30 to-primary/20 backdrop-blur-md liquid-sphere"></div>
            
            {/* Circular outlines */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
            <div className="absolute inset-4 rounded-full border border-primary/10"></div>
            
            <Mic className="w-16 h-16 text-primary relative z-10" />
          </div>
        </div>

        <button
          onClick={() => navigate("/add-medicine")}
          className="flex items-center gap-2 text-primary font-medium hover:underline transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>add your medicine</span>
        </button>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Home;
