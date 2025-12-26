import { Home, Archive, User, TrendingUp, Plus } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useRef } from "react";

interface BottomNavProps {
  onCameraClick?: () => void;
  onGalleryClick?: () => void;
}

const BottomNav = ({ onCameraClick, onGalleryClick }: BottomNavProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handlePlusClick = () => {
    // Show native action sheet by triggering camera input with capture
    if (onCameraClick) {
      // Create a temporary input to show native camera/gallery picker
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file && onGalleryClick) {
          // Dispatch a custom event with the file
          const event = new CustomEvent('nav-file-selected', { detail: file });
          window.dispatchEvent(event);
        }
      };
      input.click();
    } else {
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

          {/* Plus icon */}
          <button 
            onClick={handlePlusClick}
            className="flex items-center justify-center -mt-6"
          >
            <div className="relative w-14 h-14 flex items-center justify-center">
              {/* Outer circle border */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/50" />
              {/* Inner circle fill */}
              <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-foreground" />
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
          <input 
            ref={galleryInputRef}
            type="file" 
            accept="image/*"
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