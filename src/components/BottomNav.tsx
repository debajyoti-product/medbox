import { Home, Archive, User, TrendingUp } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useRef } from "react";

interface BottomNavProps {
  onCameraClick?: () => void;
}

const BottomNav = ({ onCameraClick }: BottomNavProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraIconClick = () => {
    if (onCameraClick) {
      onCameraClick();
    } else {
      // Fallback to file picker if no camera handler
      fileInputRef.current?.click();
    }
  };

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

          {/* Camera lens icon */}
          <button 
            onClick={handleCameraIconClick}
            className="flex items-center justify-center -mt-6"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Outer circle border */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/40" />
              {/* Inner circle fill */}
              <div className="w-8 h-8 rounded-full bg-primary/70 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-background/30" />
              </div>
            </div>
          </button>

          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            capture="environment"
            className="hidden" 
          />

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