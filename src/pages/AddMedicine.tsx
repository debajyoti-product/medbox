import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pill, Clock, FileText, Syringe, Wind } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type Medicine = {
  name: string;
  type: string;
  perServing: number;
  timesPerDay: number;
  days: number;
};

const medicineTypes = [
  { value: "tablet", label: "Tablet", icon: Pill },
  { value: "capsule", label: "Capsule", icon: Pill },
  { value: "injection", label: "Injection", icon: Syringe },
  { value: "spray", label: "Spray", icon: Wind },
];

const AddMedicine = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("medicine");
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", type: "tablet", perServing: 1, timesPerDay: 1, days: 1 },
  ]);
  const [scheduleTime, setScheduleTime] = useState({ hour: 8, minute: 0, period: "AM" });
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", type: "tablet", perServing: 1, timesPerDay: 1, days: 1 }]);
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string | number) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const adjustValue = (index: number, field: "perServing" | "timesPerDay" | "days", increment: boolean) => {
    const current = medicines[index][field];
    const newValue = increment ? current + 1 : Math.max(1, current - 1);
    updateMedicine(index, field, newValue);
  };

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, type: 'hour' | 'minute') => {
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const itemHeight = 60;
    const index = Math.round(scrollTop / itemHeight);
    
    if (type === 'hour') {
      setScheduleTime(prev => ({ ...prev, hour: (index % 12) + 1 }));
    } else {
      setScheduleTime(prev => ({ ...prev, minute: (index % 4) * 15 }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
      <div className="max-w-2xl mx-auto p-6 space-y-6 animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-2 bg-card">
            <TabsTrigger value="medicine" disabled={activeTab !== "medicine"} className="flex flex-col items-center gap-2 py-3">
              <Pill className="w-5 h-5" />
              <span className="text-xs">Medicine</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" disabled={activeTab === "medicine"} className="flex flex-col items-center gap-2 py-3">
              <Clock className="w-5 h-5" />
              <span className="text-xs">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="ailment" disabled={activeTab !== "ailment"} className="flex flex-col items-center gap-2 py-3">
              <FileText className="w-5 h-5" />
              <span className="text-xs">Ailment</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medicine" className="space-y-6">
            {medicines.map((medicine, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Medicine Name"
                    value={medicine.name}
                    onChange={(e) => updateMedicine(index, "name", e.target.value)}
                    className="h-12 flex-1 bg-card border-border"
                  />
                  <Select
                    value={medicine.type}
                    onValueChange={(value) => updateMedicine(index, "type", value)}
                  >
                    <SelectTrigger className="w-32 h-12 bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {medicineTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustValue(index, "perServing", false)}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-[hsl(320,70%,55%)] flex items-center justify-center text-white hover:opacity-90"
                  >
                    <span className="text-lg font-medium">−</span>
                  </button>
                  <Input
                    type="number"
                    value={medicine.perServing}
                    onChange={(e) => updateMedicine(index, "perServing", parseInt(e.target.value) || 1)}
                    className="h-12 flex-1 bg-card border-border"
                  />
                  <button
                    onClick={() => adjustValue(index, "perServing", true)}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-[hsl(320,70%,55%)] flex items-center justify-center text-white hover:opacity-90"
                  >
                    <span className="text-lg font-medium">+</span>
                  </button>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Per Serving</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustValue(index, "timesPerDay", false)}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-[hsl(320,70%,55%)] flex items-center justify-center text-white hover:opacity-90"
                  >
                    <span className="text-lg font-medium">−</span>
                  </button>
                  <Input
                    type="number"
                    value={medicine.timesPerDay}
                    onChange={(e) => updateMedicine(index, "timesPerDay", parseInt(e.target.value) || 1)}
                    className="h-12 flex-1 bg-card border-border"
                  />
                  <button
                    onClick={() => adjustValue(index, "timesPerDay", true)}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-[hsl(320,70%,55%)] flex items-center justify-center text-white hover:opacity-90"
                  >
                    <span className="text-lg font-medium">+</span>
                  </button>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Times A Day</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustValue(index, "days", false)}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-[hsl(320,70%,55%)] flex items-center justify-center text-white hover:opacity-90"
                  >
                    <span className="text-lg font-medium">−</span>
                  </button>
                  <Input
                    type="number"
                    value={medicine.days}
                    onChange={(e) => updateMedicine(index, "days", parseInt(e.target.value) || 1)}
                    className="h-12 flex-1 bg-card border-border"
                  />
                  <button
                    onClick={() => adjustValue(index, "days", true)}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-[hsl(320,70%,55%)] flex items-center justify-center text-white hover:opacity-90"
                  >
                    <span className="text-lg font-medium">+</span>
                  </button>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Days</span>
                </div>
              </div>
            ))}

            <Button
              variant="glass"
              className="w-full rounded-full"
              onClick={addMedicine}
            >
              Add Medicine
            </Button>

            <div className="rounded-2xl bg-card shadow-lg p-2 flex gap-2">
              <Button
                variant="gradient"
                className="flex-1 rounded-full h-12"
                onClick={() => setActiveTab("schedule")}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="p-6 rounded-xl shadow-md bg-card border-border">
              <p className="text-sm text-foreground">
                {medicines[0]?.name || "Medicine"}, {medicines[0]?.perServing} Per Serving, {medicines[0]?.timesPerDay} Times A Day For {medicines[0]?.days} Days
              </p>
            </Card>

            <div className="flex items-center justify-center gap-6 p-8">
              <div className="relative h-48 overflow-hidden">
                <div 
                  ref={hourScrollRef}
                  onScroll={() => handleScroll(hourScrollRef, 'hour')}
                  className="h-48 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                  style={{ scrollSnapType: 'y mandatory' }}
                >
                  <div className="h-24"></div>
                  {[1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
                    <div key={hour} className="h-16 flex items-center justify-center snap-center">
                      <span className="text-4xl font-semibold text-muted-foreground">
                        {hour.toString().padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                  <div className="h-24"></div>
                </div>
                <div className="absolute top-1/2 left-0 right-0 h-16 -translate-y-1/2 border-y-2 border-accent/30 pointer-events-none"></div>
              </div>

              <span className="text-4xl font-semibold">:</span>

              <div className="relative h-48 overflow-hidden">
                <div 
                  ref={minuteScrollRef}
                  onScroll={() => handleScroll(minuteScrollRef, 'minute')}
                  className="h-48 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                  style={{ scrollSnapType: 'y mandatory' }}
                >
                  <div className="h-24"></div>
                  {[0, 30, 45].map((min) => (
                    <div key={min} className="h-16 flex items-center justify-center snap-center">
                      <span className="text-4xl font-semibold text-muted-foreground">
                        {min.toString().padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                  <div className="h-24"></div>
                </div>
                <div className="absolute top-1/2 left-0 right-0 h-16 -translate-y-1/2 border-y-2 border-accent/30 pointer-events-none"></div>
              </div>

              <button 
                onClick={() => setScheduleTime(prev => ({ ...prev, period: prev.period === "AM" ? "PM" : "AM" }))}
                className="text-2xl font-semibold ml-4 hover:text-accent transition-colors"
              >
                {scheduleTime.period}
              </button>
            </div>

            <div className="rounded-2xl bg-card shadow-lg p-2 flex gap-2">
              <Button
                variant="ghost"
                className="flex-1 rounded-full h-12"
                onClick={() => setActiveTab("medicine")}
              >
                Back
              </Button>
              <Button
                variant="gradient"
                className="flex-1 rounded-full h-12"
                onClick={() => setActiveTab("ailment")}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ailment" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground text-center">
              What Are You Taking This For?
            </h2>

            <div className="space-y-2">
              <Input
                placeholder="Fever, Jaundice, Headache Etc"
                className="h-12 bg-card border-border"
              />
              <p className="text-xs text-muted-foreground">
                We Won't Share This With Anyone
              </p>
            </div>

            <div className="rounded-2xl bg-card shadow-lg p-2 flex gap-2">
              <Button
                variant="ghost"
                className="flex-1 rounded-full h-12"
                onClick={() => setActiveTab("schedule")}
              >
                Back
              </Button>
              <Button
                variant="gradient"
                className="flex-1 rounded-full h-12"
                onClick={() => navigate("/home")}
              >
                Confirm
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default AddMedicine;
