import { Pill, Syringe, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicineCardProps {
  name: string;
  type: string;
  perServing: number;
  timesPerDay: number;
  className?: string;
}

const typeIcons = {
  tablet: Pill,
  capsule: Pill,
  injection: Syringe,
  spray: Wind,
};

const MedicineCard = ({ name, type, perServing, timesPerDay, className }: MedicineCardProps) => {
  const Icon = typeIcons[type as keyof typeof typeIcons] || Pill;
  const frequency = timesPerDay === 1 ? "once a day" : `${timesPerDay} times a day`;

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm",
      className
    )}>
      <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {perServing} {type}{perServing > 1 ? "s" : ""}, {frequency}
        </p>
      </div>
      <div className="w-6 h-6 rounded-full border-2 border-border" />
    </div>
  );
};

export default MedicineCard;
