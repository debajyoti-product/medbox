import { Home, Archive, User, TrendingUp, Plus } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 px-6">
      <div className="max-w-2xl mx-auto bg-card/80 backdrop-blur-md border border-border rounded-full px-5 py-2.5 shadow-lg flex items-center justify-around relative">
        <NavLink 
          to="/home" 
          className="flex flex-col items-center gap-0.5 transition-colors"
          activeClassName="text-accent"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>
        
        <NavLink 
          to="/vault" 
          className="flex flex-col items-center gap-0.5 transition-colors"
          activeClassName="text-accent"
        >
          <Archive className="w-5 h-5" />
          <span className="text-[10px] font-medium">Vault</span>
        </NavLink>

        {/* Add Medicine Button - positioned between Vault and Course */}
        <div 
          onClick={() => navigate("/add-medicine")}
          className="relative -mt-8 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-12 h-12 relative flex items-center justify-center rounded-full" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            {/* Outer gradient circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(350,60%,70%)]/40 via-[hsl(25,80%,65%)]/30 to-[hsl(35,40%,85%)]/30"></div>
            
            {/* Circular outline */}
            <div className="absolute inset-0 rounded-full border border-[hsl(350,60%,70%)]/40"></div>
            
            {/* Plus Icon */}
            <div className="relative z-10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-[hsl(20,25%,20%)]" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <NavLink 
          to="/course" 
          className="flex flex-col items-center gap-0.5 transition-colors"
          activeClassName="text-accent"
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-medium">Course</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className="flex flex-col items-center gap-0.5 transition-colors"
          activeClassName="text-accent"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
