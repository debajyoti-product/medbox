import { Home, Archive, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass rounded-full px-8 py-3 shadow-lg flex items-center gap-8">
        <NavLink 
          to="/home" 
          className="flex flex-col items-center gap-1 transition-colors"
          activeClassName="text-primary"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </NavLink>
        
        <NavLink 
          to="/vault" 
          className="flex flex-col items-center gap-1 transition-colors"
          activeClassName="text-primary"
        >
          <Archive className="w-6 h-6" />
          <span className="text-xs font-medium">Vault</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className="flex flex-col items-center gap-1 transition-colors"
          activeClassName="text-primary"
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
