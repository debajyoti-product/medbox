import { cn } from "@/lib/utils";

interface MedBoxIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const MedBoxIcon = ({ size = "md", className }: MedBoxIconProps) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const strokeWidth = size === "sm" ? 2 : 1.5;

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(350, 60%, 70%)" />
            <stop offset="50%" stopColor="hsl(25, 80%, 65%)" />
            <stop offset="100%" stopColor="hsl(35, 40%, 85%)" />
          </linearGradient>
        </defs>
        
        {/* Clock circle */}
        <circle
          cx="50"
          cy="22"
          r="18"
          stroke="url(#iconGradient)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Clock hands */}
        <line
          x1="50"
          y1="22"
          x2="50"
          y2="12"
          stroke="url(#iconGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="22"
          x2="58"
          y2="22"
          stroke="url(#iconGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Clock top tick */}
        <line
          x1="50"
          y1="6"
          x2="50"
          y2="4"
          stroke="url(#iconGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Heart made from pill shape - left half */}
        <path
          d="M50 110 
             C50 110 20 85 20 65
             C20 55 25 48 35 48
             C42 48 47 52 50 58"
          stroke="url(#iconGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Heart made from pill shape - right half */}
        <path
          d="M50 110 
             C50 110 80 85 80 65
             C80 55 75 48 65 48
             C58 48 53 52 50 58"
          stroke="url(#iconGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Center dividing line (pill split) */}
        <line
          x1="50"
          y1="58"
          x2="50"
          y2="95"
          stroke="url(#iconGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Left pill rounded cap detail */}
        <ellipse
          cx="35"
          cy="52"
          rx="8"
          ry="4"
          stroke="url(#iconGradient)"
          strokeWidth={strokeWidth * 0.8}
          fill="none"
          transform="rotate(-45 35 52)"
        />
        
        {/* Right pill rounded cap detail */}
        <ellipse
          cx="65"
          cy="52"
          rx="8"
          ry="4"
          stroke="url(#iconGradient)"
          strokeWidth={strokeWidth * 0.8}
          fill="none"
          transform="rotate(45 65 52)"
        />
      </svg>
    </div>
  );
};

export default MedBoxIcon;
