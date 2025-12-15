interface MicrophoneIconProps {
  className?: string;
  size?: number;
}

const MicrophoneIcon = ({ className = "", size = 24 }: MicrophoneIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      {/* Mic head - rounded capsule */}
      <rect x="8" y="2" width="8" height="12" rx="4" />
      
      {/* U-shaped stand */}
      <path
        d="M6 11v2a6 6 0 0 0 12 0v-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Vertical stem */}
      <line
        x1="12"
        y1="19"
        x2="12"
        y2="22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Base */}
      <line
        x1="9"
        y1="22"
        x2="15"
        y2="22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MicrophoneIcon;
