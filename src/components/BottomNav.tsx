import { Home, Archive, User, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 px-6">
      <div className="max-w-md mx-auto relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 blur-xl opacity-40" />
        <div className="relative bg-white border border-border rounded-full px-8 py-3 shadow-sm flex items-center justify-between">
          <Link to="/home" className="flex flex-col items-center gap-1 transition-colors">
            <Home className={`w-6 h-6 ${(path === "/" || path === "/home") ? "[stroke:url(#orange-red)]" : "text-muted-foreground"}`} />
            <span className={`text-[10px] font-medium ${(path === "/" || path === "/home") ? "bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent" : "text-muted-foreground"}`}>Home</span>
          </Link>
          
          <Link to="/vault" className="flex flex-col items-center gap-1 transition-colors">
            <Archive className={`w-6 h-6 ${path === "/vault" ? "[stroke:url(#orange-red)]" : "text-muted-foreground"}`} />
            <span className={`text-[10px] font-medium ${path === "/vault" ? "bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent" : "text-muted-foreground"}`}>Vault</span>
          </Link>

          <Link to="/course" className="flex flex-col items-center gap-1 transition-colors">
            <TrendingUp className={`w-6 h-6 ${path === "/course" ? "[stroke:url(#orange-red)]" : "text-muted-foreground"}`} />
            <span className={`text-[10px] font-medium ${path === "/course" ? "bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent" : "text-muted-foreground"}`}>Course</span>
          </Link>
          
          <Link to="/profile" className="flex flex-col items-center gap-1 transition-colors">
            <User className={`w-6 h-6 ${path === "/profile" ? "[stroke:url(#orange-red)]" : "text-muted-foreground"}`} />
            <span className={`text-[10px] font-medium ${path === "/profile" ? "bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent" : "text-muted-foreground"}`}>Profile</span>
          </Link>
        </div>
      </div>
      <svg width="0" height="0">
        <linearGradient id="orange-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="hsl(var(--accent))" offset="0%" />
          <stop stopColor="hsl(var(--primary))" offset="100%" />
        </linearGradient>
      </svg>
    </nav>
  );
};

export default BottomNav;