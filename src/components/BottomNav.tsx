import { Home, Archive, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 px-6">
      <div className="max-w-2xl mx-auto bg-card/80 backdrop-blur-md border border-border rounded-full px-8 py-3 shadow-lg flex items-center justify-around">
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
