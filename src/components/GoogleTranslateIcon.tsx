import { cn } from "@/lib/utils";

interface GoogleTranslateIconProps {
  className?: string;
  size?: number;
}

const GoogleTranslateIcon = ({ className, size = 20 }: GoogleTranslateIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("", className)}
      fill="currentColor"
    >
      <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17A15.4 15.4 0 019.25 12.5a15.43 15.43 0 01-2.42-3.54H4.76A17.7 17.7 0 007.9 14.1L2.3 19.6l1.4 1.4 5.5-5.5 3.42 3.42.8-1.95-.54-.9zM21.54 10h-2.17l-4.5 12h2.08l1.12-3h4.93l1.12 3H26l-4.46-12zm-2.57 7l1.78-4.77L22.54 17h-3.57z"/>
    </svg>
  );
};

export default GoogleTranslateIcon;
