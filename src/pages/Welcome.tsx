import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import medboxLogo from "@/assets/medbox-logo-new.png";
import { useAuth } from "@/hooks/useAuth";

const Welcome = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/home");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto transition to signup after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading && !user) {
        navigate("/signup");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center space-y-4 max-w-md w-full">
        <div className={`space-y-6 text-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <img 
            src={medboxLogo} 
            alt="MedBox Logo" 
            className="w-32 h-32 object-contain mx-auto"
          />
          <div className="space-y-3">
            <h1 className="text-6xl font-bold text-foreground tracking-tight">
              Med<span className="text-primary">Box</span>
            </h1>
            <p className="text-lg text-muted-foreground font-normal">
              Your Trusted Medicine Companion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
