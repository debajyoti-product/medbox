import { Mic, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-2xl mx-auto p-6 space-y-12 animate-fade-in flex flex-col items-start justify-center min-h-screen">
        <div className="absolute top-6 left-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Med<span className="text-primary">Box</span>
          </h2>
        </div>
        
        <div className="space-y-2 w-full">
          <h1 className="text-7xl font-stylish text-foreground">
            Welcome
          </h1>
          <p className="text-base text-muted-foreground font-normal">
            tell us your medicine
          </p>
        </div>

        <div className="relative w-full flex items-center justify-center my-8">
          <div className="w-56 h-56 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/30 liquid-sphere flex items-center justify-center">
            <Mic className="w-16 h-16 text-primary" />
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
