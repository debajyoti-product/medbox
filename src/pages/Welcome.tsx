import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import welcomeHero from "@/assets/welcome-hero.png";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex flex-col items-center justify-between p-6 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 max-w-md w-full">
        <img 
          src={welcomeHero} 
          alt="Welcome To MedBox" 
          className="w-full max-w-md mx-auto rounded-xl"
        />
        <div className="space-y-3 text-center">
          <h1 className="text-5xl font-semibold text-foreground">
            MedBox
          </h1>
          <p className="text-base text-muted-foreground font-normal">
            Your Trusted Medicine Companion
          </p>
        </div>
      </div>
      
      <Button 
        onClick={() => navigate("/signup")}
        size="lg"
        variant="gradient"
        className="w-full max-w-md text-base h-12 rounded-full font-medium"
      >
        Get Started
      </Button>
    </div>
  );
};

export default Welcome;
