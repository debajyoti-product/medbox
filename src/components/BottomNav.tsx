import { Home, Archive, User, TrendingUp, Plus } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 px-6">
      <div className="max-w-2xl mx-auto relative">
        {/* Main nav bar */}
        <div className="relative bg-card/85 backdrop-blur-md border border-border rounded-full px-5 py-2.5 shadow-lg flex items-center justify-around">
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

          {/* Spacer for the center button */}
          <div className="w-16"></div>

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

        {/* Add Medicine Button - floating above */}
        <div 
          onClick={() => navigate("/add-medicine")}
          className="absolute left-1/2 -translate-x-1/2 -top-8 cursor-pointer hover:scale-105 transition-transform z-30"
        >
          <div className="w-16 h-16 rounded-full bg-background p-1.5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div className="w-full h-full flex items-center justify-center rounded-full bg-[hsl(35,40%,92%)] border border-[hsl(350,60%,70%)]/40">
              <Plus className="w-7 h-7 text-[hsl(20,25%,20%)]" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
