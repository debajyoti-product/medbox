import { Home, Archive, User, TrendingUp } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const BottomNav = () => {
  return <nav className="fixed bottom-6 left-0 right-0 z-50 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card/85 backdrop-blur-md border border-border rounded-full px-5 py-2.5 shadow-lg flex items-center justify-between">
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