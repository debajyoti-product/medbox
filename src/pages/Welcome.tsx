import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import welcomeHero from "@/assets/welcome-hero.png";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-6">
          <img 
            src={welcomeHero} 
            alt="Welcome to MedBox" 
            className="w-full max-w-sm mx-auto rounded-xl"
          />
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-foreground">
              Welcome to MedBox
            </h1>
            <p className="text-base text-muted-foreground font-normal">
              Your trusted companion to help you complete your medicine courses
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate("/signup")}
          size="lg"
          variant="glass"
          className="w-full text-base h-12 rounded-full font-medium"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
