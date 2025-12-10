import { Pill, Syringe, Wind, CircleDot, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicineCardProps {
  name: string;
  type: string;
  className?: string;
}

const typeIcons = {
  tablet: Pill,
  capsule: CircleDot,
  injection: Syringe,
  spray: Wind,
  liquid: Droplets,
};

const MedicineCard = ({ name, type, className }: MedicineCardProps) => {
  const Icon = typeIcons[type as keyof typeof typeIcons] || Pill;

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm",
      className
    )}>
      <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-foreground">{name}</h3>
    </div>
  );
};

export default MedicineCard;
