import { Home, Archive, User, TrendingUp } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const BottomNav = () => {
  return <nav className="fixed bottom-6 left-0 right-0 z-50 px-6">
      <div className="max-w-2xl mx-auto relative">
        {/* Gradient background behind the glass */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-accent/20 to-secondary/30 blur-xl opacity-60" />
        
        <div className="relative bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] flex items-center justify-between">
          <NavLink to="/home" className="flex flex-col items-center gap-0.5 transition-colors" activeClassName="text-accent">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </NavLink>
          
          <NavLink to="/vault" className="flex flex-col items-center gap-0.5 transition-colors" activeClassName="text-accent">
            <Archive className="w-5 h-5" />
            <span className="text-[10px] font-medium">Vault</span>
          </NavLink>

          <NavLink to="/course" className="flex flex-col items-center gap-0.5 transition-colors" activeClassName="text-accent">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-medium">Course</span>
          </NavLink>
          
          <NavLink to="/profile" className="flex flex-col items-center gap-0.5 transition-colors" activeClassName="text-accent">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </NavLink>
        </div>
      </div>
    </nav>;
};
export default BottomNav;