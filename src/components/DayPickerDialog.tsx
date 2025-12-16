import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DayPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDaysSelect: (days: number[]) => void;
  initialDays?: number[];
  maxDays?: number;
}

const vibrate = (duration: number = 10) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
};

const DayPickerDialog = ({
  open,
  onOpenChange,
  onDaysSelect,
  initialDays = [],
  maxDays = 30,
}: DayPickerDialogProps) => {
  const [selectedDays, setSelectedDays] = useState<number[]>(initialDays);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastTouchedDay = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedDays(initialDays);
    }
  }, [open, initialDays]);

  const toggleDay = useCallback((day: number) => {
    vibrate(15);
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      }
      return [...prev, day].sort((a, b) => a - b);
    });
  }, []);

  const handleTouchStart = (day: number) => {
    isDragging.current = true;
    lastTouchedDay.current = day;
    toggleDay(day);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const dayAttr = element?.getAttribute("data-day");
    
    if (dayAttr) {
      const day = parseInt(dayAttr);
      if (day !== lastTouchedDay.current && !isNaN(day)) {
        lastTouchedDay.current = day;
        if (!selectedDays.includes(day)) {
          vibrate(8);
          setSelectedDays((prev) => [...prev, day].sort((a, b) => a - b));
        }
      }
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    lastTouchedDay.current = null;
  };

  const handleConfirm = () => {
    vibrate(20);
    onDaysSelect(selectedDays);
    onOpenChange(false);
  };

  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto bg-card/95 backdrop-blur-xl border-border rounded-3xl p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center text-foreground">
            Select Days
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Tap Or Swipe To Select Multiple Days
          </p>

          <div
            ref={containerRef}
            className="grid grid-cols-7 gap-2 py-4"
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {days.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  data-day={day}
                  onClick={() => toggleDay(day)}
                  onTouchStart={() => handleTouchStart(day)}
                  className={`
                    aspect-square rounded-full flex items-center justify-center text-sm font-medium
                    transition-all duration-200 touch-none select-none
                    ${isSelected 
                      ? "bg-[hsl(20,25%,25%)] text-white" 
                      : "bg-transparent text-foreground"
                    }
                  `}
                  style={!isSelected ? {
                    background: "linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, hsl(350, 60%, 70%), hsl(25, 80%, 65%), hsl(35, 40%, 85%)) border-box",
                    border: "2px solid transparent",
                  } : undefined}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {selectedDays.length} Day{selectedDays.length !== 1 ? "s" : ""} Selected
          </p>

          <Button
            variant="gradient"
            className="w-full rounded-full h-12"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayPickerDialog;
