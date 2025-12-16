import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pill, Clock, FileText, Syringe, Wind, Droplets, CircleDot } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import TimePickerDialog from "@/components/TimePickerDialog";
import DayPickerDialog from "@/components/DayPickerDialog";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useMedicines, type Medicine } from "@/hooks/useMedicines";
import { useToast } from "@/hooks/use-toast";

const medicineTypes = [
  { value: "tablet", label: "Tablet", icon: Pill },
  { value: "capsule", label: "Capsule", icon: CircleDot },
  { value: "injection", label: "Injection", icon: Syringe },
  { value: "spray", label: "Spray", icon: Wind },
  { value: "liquid", label: "Liquid", icon: Droplets },
];

const getMedicineIcon = (type: string) => {
  const found = medicineTypes.find((t) => t.value === type);
  return found ? found.icon : Pill;
};

const getTypeLabel = (type: string, count: number) => {
  const labels: Record<string, { singular: string; plural: string }> = {
    tablet: { singular: "Tablet", plural: "Tablets" },
    capsule: { singular: "Capsule", plural: "Capsules" },
    injection: { singular: "Injection", plural: "Injections" },
    spray: { singular: "Spray", plural: "Sprays" },
    liquid: { singular: "ml", plural: "ml" },
  };
  const label = labels[type] || labels.tablet;
  return count === 1 ? label.singular : label.plural;
};

const getTimesLabel = (times: number) => {
  if (times === 1) return "Once A Day";
  if (times === 2) return "Twice A Day";
  return `${times} Times A Day`;
};

const AddMedicine = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { addMedicines } = useMedicines();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("medicine");
  const [ailment, setAilment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      name: "",
      type: "tablet",
      perServing: 1,
      timesPerDay: 1,
      days: 1,
      selectedDays: [],
    },
  ]);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [selectedMedicineIndex, setSelectedMedicineIndex] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signup");
    }
  }, [user, authLoading, navigate]);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        type: "tablet",
        perServing: 1,
        timesPerDay: 1,
        days: 1,
        selectedDays: [],
      },
    ]);
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string | number) => {
    const updated = [...medicines];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setMedicines(updated);
  };

  const vibrate = (duration: number = 10) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };

  const adjustValue = (index: number, field: "perServing" | "timesPerDay", increment: boolean) => {
    vibrate(15);
    const current = medicines[index][field];
    const newValue = increment ? current + 1 : Math.max(1, current - 1);
    updateMedicine(index, field, newValue);
  };

  const openDayPicker = (index: number) => {
    setSelectedMedicineIndex(index);
    setDayPickerOpen(true);
  };

  const handleDaysSelect = (days: Date[]) => {
    const updated = [...medicines];
    updated[selectedMedicineIndex] = {
      ...updated[selectedMedicineIndex],
      selectedDays: days,
      days: days.length || 1,
    };
    setMedicines(updated);
  };

  const formatDays = (selectedDays?: Date[]) => {
    if (!selectedDays || selectedDays.length === 0) return "Set Days";
    if (selectedDays.length === 1) {
      const d = selectedDays[0];
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }
    return `${selectedDays.length} Days`;
  };

  const openTimePicker = (index: number) => {
    setSelectedMedicineIndex(index);
    setTimePickerOpen(true);
  };

  const handleTimeSelect = (hour: number, minute: number, period: "AM" | "PM") => {
    const updated = [...medicines];
    updated[selectedMedicineIndex] = {
      ...updated[selectedMedicineIndex],
      scheduleTime: { hour, minute, period },
    };
    setMedicines(updated);
  };

  const formatTime = (time?: { hour: number; minute: number; period: "AM" | "PM" }) => {
    if (!time) return "Set Time";
    return `${time.hour}:${time.minute.toString().padStart(2, "0")} ${time.period}`;
  };

  const saveMedicines = async () => {
    const validMedicines = medicines.filter((m) => m.name.trim());
    if (validMedicines.length === 0) {
      toast({
        title: "No Medicines",
        description: "Please Add At Least One Medicine",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const medicinesWithAilment = validMedicines.map((m) => ({
      ...m,
      ailment: ailment || undefined,
    }));

    const { error } = await addMedicines(medicinesWithAilment);
    setIsSaving(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed To Save Medicines. Please Try Again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Medicines Have Been Saved",
    });
    navigate("/vault");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
      <div className="max-w-2xl mx-auto p-6 space-y-6 animate-fade-in">
        {/* Add Medicine Form Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-2 bg-card">
            <TabsTrigger value="medicine" disabled={activeTab !== "medicine"} className="flex flex-col items-center gap-2 py-3">
              <Pill className="w-5 h-5" />
              <span className="text-xs">{t("medicine")}</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" disabled={activeTab === "medicine"} className="flex flex-col items-center gap-2 py-3">
              <Clock className="w-5 h-5" />
              <span className="text-xs">{t("schedule")}</span>
            </TabsTrigger>
            <TabsTrigger value="ailment" disabled={activeTab !== "ailment"} className="flex flex-col items-center gap-2 py-3">
              <FileText className="w-5 h-5" />
              <span className="text-xs">{t("ailment")}</span>
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
                  <Select value={medicine.type} onValueChange={(value) => updateMedicine(index, "type", value)}>
                    <SelectTrigger className="w-32 h-12 bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
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
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => adjustValue(index, "perServing", false)}
                      className="w-8 h-8 rounded-full bg-[hsl(20,25%,25%)] flex items-center justify-center text-white hover:opacity-90 shrink-0"
                    >
                      <span className="text-lg font-medium">−</span>
                    </button>
                    <Input
                      type="number"
                      min="1"
                      value={medicine.perServing || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateMedicine(index, "perServing", val === "" ? 0 : parseInt(val) || 0);
                      }}
                      onBlur={(e) => {
                        if (!e.target.value || parseInt(e.target.value) < 1) {
                          updateMedicine(index, "perServing", 1);
                        }
                      }}
                      className="h-12 flex-1 bg-card border-border text-center"
                    />
                    <button
                      onClick={() => adjustValue(index, "perServing", true)}
                      className="w-8 h-8 rounded-full bg-[hsl(20,25%,25%)] flex items-center justify-center text-white hover:opacity-90 shrink-0"
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap w-32 text-right">{t("perServing")}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => adjustValue(index, "timesPerDay", false)}
                      className="w-8 h-8 rounded-full bg-[hsl(20,25%,25%)] flex items-center justify-center text-white hover:opacity-90 shrink-0"
                    >
                      <span className="text-lg font-medium">−</span>
                    </button>
                    <Input
                      type="number"
                      min="1"
                      value={medicine.timesPerDay || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateMedicine(index, "timesPerDay", val === "" ? 0 : parseInt(val) || 0);
                      }}
                      onBlur={(e) => {
                        if (!e.target.value || parseInt(e.target.value) < 1) {
                          updateMedicine(index, "timesPerDay", 1);
                        }
                      }}
                      className="h-12 flex-1 bg-card border-border text-center"
                    />
                    <button
                      onClick={() => adjustValue(index, "timesPerDay", true)}
                      className="w-8 h-8 rounded-full bg-[hsl(20,25%,25%)] flex items-center justify-center text-white hover:opacity-90 shrink-0"
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap w-32 text-right">{t("timesADay")}</span>
                </div>
              </div>
            ))}

            <Button
              className="w-full rounded-full h-12 bg-card text-foreground hover:bg-card/80 transition-all"
              style={{
                background: "linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, hsl(350, 60%, 70%), hsl(25, 80%, 65%), hsl(35, 40%, 85%)) border-box",
                border: "2px solid transparent",
              }}
              onClick={addMedicine}
            >
              {t("addMedicine")}
            </Button>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            {medicines.map((medicine, index) => {
              const MedicineIcon = getMedicineIcon(medicine.type);
              return (
                <Card key={index} className="p-4 rounded-xl shadow-md bg-card border-border">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <MedicineIcon className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{medicine.name || "Medicine"}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {medicine.perServing} {getTypeLabel(medicine.type, medicine.perServing)}, {getTimesLabel(medicine.timesPerDay)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openTimePicker(index)}
                        className="px-3 py-2 rounded-full text-xs font-medium bg-[hsl(20,25%,25%)] text-white hover:opacity-90 transition-all"
                      >
                        {formatTime(medicine.scheduleTime)}
                      </button>
                      <button
                        onClick={() => openDayPicker(index)}
                        className="px-3 py-2 rounded-full text-xs font-medium transition-all"
                        style={{
                          background: "linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, hsl(350, 60%, 70%), hsl(25, 80%, 65%), hsl(35, 40%, 85%)) border-box",
                          border: "2px solid transparent",
                        }}
                      >
                        {formatDays(medicine.selectedDays)}
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="ailment" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground text-center">{t("whatAreYouTakingThisFor")}</h2>

            <div className="space-y-2">
              <Input 
                placeholder="Fever, Jaundice, Headache Etc" 
                className="h-12 bg-card border-border"
                value={ailment}
                onChange={(e) => setAilment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t("weWontShareThis")}</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Buttons - Always visible */}
        <div className="fixed bottom-32 left-0 right-0 px-6">
          <div className="max-w-2xl mx-auto flex gap-3">
            {activeTab !== "medicine" && (
              <Button
                className="flex-1 rounded-full h-12 bg-card text-foreground hover:bg-card/80 transition-all shadow-sm"
                style={{
                  background: "linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, hsl(350, 60%, 70%), hsl(25, 80%, 65%), hsl(35, 40%, 85%)) border-box",
                  border: "2px solid transparent",
                }}
                onClick={() => setActiveTab(activeTab === "schedule" ? "medicine" : "schedule")}
              >
                {t("back")}
              </Button>
            )}
            <Button 
              variant="gradient" 
              className="flex-1 rounded-full h-12 shadow-sm"
              disabled={isSaving}
              onClick={() => {
                if (activeTab === "medicine") setActiveTab("schedule");
                else if (activeTab === "schedule") setActiveTab("ailment");
                else saveMedicines();
              }}
            >
              {isSaving ? "Saving..." : activeTab === "ailment" ? t("confirm") : t("next")}
            </Button>
          </div>
        </div>
      </div>

      <TimePickerDialog
        open={timePickerOpen}
        onOpenChange={setTimePickerOpen}
        onTimeSelect={handleTimeSelect}
        initialHour={medicines[selectedMedicineIndex]?.scheduleTime?.hour || 8}
        initialMinute={medicines[selectedMedicineIndex]?.scheduleTime?.minute || 0}
        initialPeriod={medicines[selectedMedicineIndex]?.scheduleTime?.period || "AM"}
      />

      <DayPickerDialog
        open={dayPickerOpen}
        onOpenChange={setDayPickerOpen}
        onDaysSelect={handleDaysSelect}
        initialDays={medicines[selectedMedicineIndex]?.selectedDays || []}
      />

      <BottomNav />
    </div>
  );
};

export default AddMedicine;
