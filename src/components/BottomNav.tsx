import { Home, Archive, User, TrendingUp, Mic } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 px-6">
      <div className="max-w-2xl mx-auto bg-card/80 backdrop-blur-md border border-border rounded-full px-6 py-3 shadow-lg flex items-center justify-around relative">
        <NavLink 
          to="/home" 
          className="flex flex-col items-center gap-1 transition-colors"
          activeClassName="text-accent"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </NavLink>
        
        <NavLink 
          to="/vault" 
          className="flex flex-col items-center gap-1 transition-colors"
          activeClassName="text-accent"
        >
          <Archive className="w-6 h-6" />
          <span className="text-xs font-medium">Vault</span>
        </NavLink>

        {/* Miniature Voice Sphere - positioned between Vault and Course */}
        <div 
          onClick={() => navigate("/voice-recording")}
          className="relative -mt-10 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-14 h-14 relative flex items-center justify-center shadow-lg rounded-full" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            {/* Animated gradient circles */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(350,60%,70%)]/40 via-[hsl(25,80%,65%)]/30 to-[hsl(35,40%,85%)]/30 backdrop-blur-xl liquid-sphere"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[hsl(350,60%,70%)]/50 via-[hsl(25,80%,65%)]/40 to-[hsl(35,40%,85%)]/40 backdrop-blur-lg liquid-sphere-reverse"></div>
            
            {/* Circular outline */}
            <div className="absolute inset-0 rounded-full border border-[hsl(350,60%,70%)]/40"></div>
            
            {/* Mic Icon */}
            <div className="relative z-10 flex items-center justify-center">
              <Mic className="w-6 h-6 fill-[hsl(20,25%,20%)] stroke-none" />
            </div>
          </div>
        </div>

        <NavLink 
          to="/course" 
          className="flex flex-col items-center gap-1 transition-colors"
          activeClassName="text-accent"
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-xs font-medium">Course</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className="flex flex-col items-center gap-1 transition-colors"
          activeClassName="text-accent"
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
