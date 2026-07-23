import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DayPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDaysSelect: (days: Date[]) => void;
  initialDays?: Date[];
}

const vibrate = (duration: number = 10) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  } catch (e) {
    // Vibration not supported
  }
};

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const DayPickerDialog = ({
  open,
  onOpenChange,
  onDaysSelect,
  initialDays = [],
}: DayPickerDialogProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDates, setSelectedDates] = useState<Date[]>(initialDays);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastTouchedDate = useRef<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedDates(initialDays);
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
    }
  }, [open]);

  const getMonthName = (month: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month];
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert to Monday = 0
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const todayCompare = new Date(today);
    todayCompare.setHours(0, 0, 0, 0);
    return compareDate < todayCompare;
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => d.toDateString() === date.toDateString());
  };

  const toggleDate = useCallback((date: Date) => {
    if (isPastDate(date)) return;
    
    vibrate(15);
    setSelectedDates((prev) => {
      const dateStr = date.toDateString();
      if (prev.some(d => d.toDateString() === dateStr)) {
        return prev.filter((d) => d.toDateString() !== dateStr);
      }
      return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
    });
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const dateAttr = element?.getAttribute("data-date");
    
    if (dateAttr) {
      const date = new Date(dateAttr);
      if (!isPastDate(date) && dateAttr !== lastTouchedDate.current && !isDateSelected(date)) {
        lastTouchedDate.current = dateAttr;
        vibrate(8);
        setSelectedDates((prev) => [...prev, date].sort((a, b) => a.getTime() - b.getTime()));
      }
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    lastTouchedDate.current = null;
  };

  const prevMonth = () => {
    vibrate(10);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    vibrate(10);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleConfirm = () => {
    vibrate(20);
    onDaysSelect(selectedDates);
    onOpenChange(false);
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const prevMonthDays = getDaysInMonth(currentMonth === 0 ? 11 : currentMonth - 1, currentMonth === 0 ? currentYear - 1 : currentYear);

  // Calculate days to show
  const calendarDays: { date: Date; isCurrentMonth: boolean }[] = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const date = new Date(currentMonth === 0 ? currentYear - 1 : currentYear, currentMonth === 0 ? 11 : currentMonth - 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    calendarDays.push({ date, isCurrentMonth: true });
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays.length; // 6 rows * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentMonth === 11 ? currentYear + 1 : currentYear, currentMonth === 11 ? 0 : currentMonth + 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  // Can go to previous month only if it's not before current month
  const canGoPrev = currentYear > today.getFullYear() || 
    (currentYear === today.getFullYear() && currentMonth > today.getMonth());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-[calc(100%-2rem)] bg-card/95 backdrop-blur-xl border-border rounded-3xl p-5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevMonth}
              disabled={!canGoPrev}
              className={`p-2 rounded-full transition-all ${canGoPrev ? 'hover:bg-secondary' : 'opacity-30 cursor-not-allowed'}`}
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h3 className="text-lg font-semibold text-foreground min-w-[140px] text-center">
              {getMonthName(currentMonth)} {currentYear}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-secondary transition-all"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAYS.map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div
            ref={containerRef}
            className="grid grid-cols-7 gap-2"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {calendarDays.map(({ date, isCurrentMonth }, index) => {
              const isSelected = isDateSelected(date);
              const isPast = isPastDate(date);
              const isTodayDate = isToday(date);
              
              return (
                <button
                  key={index}
                  data-date={date.toISOString()}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    if (!isPast && isCurrentMonth) {
                      isDragging.current = true;
                      lastTouchedDate.current = date.toDateString();
                      toggleDate(date);
                    }
                  }}
                  onPointerUp={() => {
                    isDragging.current = false;
                    lastTouchedDate.current = null;
                  }}
                  disabled={isPast || !isCurrentMonth}
                  className={`
                    w-9 h-10 rounded-lg flex items-center justify-center text-sm font-medium mx-auto
                    transition-all duration-200 select-none active:scale-95
                    ${!isCurrentMonth ? 'opacity-30 cursor-not-allowed' : ''}
                    ${isPast && isCurrentMonth ? 'opacity-40 cursor-not-allowed' : ''}
                    ${isSelected 
                      ? "bg-primary text-primary-foreground" 
                      : isTodayDate && isCurrentMonth
                        ? "ring-2 ring-primary text-foreground"
                        : "text-foreground"
                    }
                  `}
                  style={!isSelected && isCurrentMonth && !isPast ? {
                    background: "linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, hsl(350, 60%, 70%), hsl(25, 80%, 65%), hsl(35, 40%, 85%)) border-box",
                    border: "2px solid transparent",
                  } : undefined}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {selectedDates.length} Day{selectedDates.length !== 1 ? "s" : ""} Selected
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
