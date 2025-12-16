import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTimeSelect: (hour: number, minute: number, period: "AM" | "PM") => void;
  initialHour?: number;
  initialMinute?: number;
  initialPeriod?: "AM" | "PM";
}

const vibrate = (duration: number = 10) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
};

const TimePickerDialog = ({
  open,
  onOpenChange,
  onTimeSelect,
  initialHour = 8,
  initialMinute = 0,
  initialPeriod = "AM",
}: TimePickerDialogProps) => {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState<"AM" | "PM">(initialPeriod);

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    if (open && hourScrollRef.current) {
      const hourIndex = hours.indexOf(hour);
      hourScrollRef.current.scrollTop = hourIndex * 60;
    }
    if (open && minuteScrollRef.current) {
      minuteScrollRef.current.scrollTop = minute * 60;
    }
  }, [open, hour, minute]);

  const lastHourRef = useRef(hour);
  const lastMinuteRef = useRef(minute);

  const handleHourScroll = useCallback(() => {
    if (!hourScrollRef.current) return;
    const scrollTop = hourScrollRef.current.scrollTop;
    const index = Math.round(scrollTop / 60);
    const newHour = hours[Math.min(index, hours.length - 1)] || 1;
    if (newHour !== lastHourRef.current) {
      vibrate(8);
      lastHourRef.current = newHour;
    }
    setHour(newHour);
  }, [hours]);

  const handleMinuteScroll = useCallback(() => {
    if (!minuteScrollRef.current) return;
    const scrollTop = minuteScrollRef.current.scrollTop;
    const index = Math.floor(scrollTop / 60);
    const newMinute = Math.max(0, Math.min(index, 59));
    if (newMinute !== lastMinuteRef.current) {
      vibrate(8);
      lastMinuteRef.current = newMinute;
    }
    setMinute(newMinute);
  }, []);

  const togglePeriod = () => {
    vibrate(15);
    setPeriod((p) => (p === "AM" ? "PM" : "AM"));
  };

  const handleConfirm = () => {
    vibrate(20);
    onTimeSelect(hour, minute, period);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs bg-card/95 backdrop-blur-xl border-border p-6 rounded-2xl">
        {/* Scroll hint */}
        <div className="flex justify-center mb-4">
          <div className="flex flex-col items-center text-muted-foreground animate-bounce">
            <ChevronUp className="w-5 h-5" />
            <span className="text-xs">Scroll To Change</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          {/* Hours */}
          <div className="relative h-48 w-16 overflow-hidden">
            <div
              ref={hourScrollRef}
              onScroll={handleHourScroll}
              className="h-48 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: "y mandatory" }}
            >
              <div className="h-24"></div>
              {hours.map((h) => (
                <div
                  key={h}
                  className="h-[60px] flex items-center justify-center snap-center"
                >
                  <span
                    className={`text-3xl font-semibold transition-colors ${
                      h === hour ? "text-foreground" : "text-muted-foreground/50"
                    }`}
                  >
                    {h.toString().padStart(2, "0")}
                  </span>
                </div>
              ))}
              <div className="h-24"></div>
            </div>
            <div className="absolute top-1/2 left-0 right-0 h-[60px] -translate-y-1/2 border-y-2 border-accent/30 pointer-events-none"></div>
          </div>

          <span className="text-3xl font-semibold text-foreground">:</span>

          {/* Minutes */}
          <div className="relative h-48 w-16 overflow-hidden">
            <div
              ref={minuteScrollRef}
              onScroll={handleMinuteScroll}
              className="h-48 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: "y mandatory" }}
            >
              <div className="h-24"></div>
              {minutes.map((m) => (
                <div
                  key={m}
                  className="h-[60px] flex items-center justify-center snap-center"
                >
                  <span
                    className={`text-3xl font-semibold transition-colors ${
                      m === minute ? "text-foreground" : "text-muted-foreground/50"
                    }`}
                  >
                    {m.toString().padStart(2, "0")}
                  </span>
                </div>
              ))}
              <div className="h-24"></div>
            </div>
            <div className="absolute top-1/2 left-0 right-0 h-[60px] -translate-y-1/2 border-y-2 border-accent/30 pointer-events-none"></div>
          </div>

          {/* AM/PM */}
          <button
            onClick={togglePeriod}
            className="text-2xl font-semibold ml-2 hover:text-accent transition-colors text-foreground"
          >
            {period}
          </button>
        </div>

        {/* Scroll hint bottom */}
        <div className="flex justify-center mt-4">
          <div className="flex flex-col items-center text-muted-foreground animate-bounce">
            <span className="text-xs">Scroll To Change</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>

        <Button
          variant="gradient"
          className="w-full mt-6 rounded-full h-12"
          onClick={handleConfirm}
        >
          Set Time
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TimePickerDialog;
