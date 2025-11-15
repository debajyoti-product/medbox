import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import aiSphere from "@/assets/ai-sphere.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-12 animate-fade-in flex flex-col items-center justify-center min-h-screen">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-foreground">
            Welcome!
          </h1>
          <p className="text-base text-muted-foreground font-normal">
            Add your medicine
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <img 
            src={aiSphere} 
            alt="AI Assistant" 
            className="w-48 h-48 animate-pulse"
          />
          <Mic className="w-12 h-12 text-foreground absolute" />
        </div>

        <div className="w-full max-w-md">
          <Input
            placeholder="Add your medicine"
            className="h-12 rounded-full text-center"
            onClick={() => navigate("/add-medicine")}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
