import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pill, Clock, FileText, Syringe, Wind, Droplets, CircleDot, Package, Activity } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import TimePickerDialog from "@/components/TimePickerDialog";
import { useTranslation } from "@/hooks/useTranslation";
import { Progress } from "@/components/ui/progress";

type Medicine = {
  name: string;
  type: string;
  perServing: number;
  timesPerDay: number;
  days: number;
  scheduleTime?: { hour: number; minute: number; period: "AM" | "PM" };
};

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
  const [mainTab, setMainTab] = useState("medicine");
  const [activeTab, setActiveTab] = useState("medicine");
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      name: "",
      type: "tablet",
      perServing: 1,
      timesPerDay: 1,
      days: 1,
    },
  ]);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [selectedMedicineIndex, setSelectedMedicineIndex] = useState(0);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        type: "tablet",
        perServing: 1,
        timesPerDay: 1,
        days: 1,
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

  const adjustValue = (index: number, field: "perServing" | "timesPerDay" | "days", increment: boolean) => {
    const current = medicines[index][field];
    const newValue = increment ? current + 1 : Math.max(1, current - 1);
    updateMedicine(index, field, newValue);
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

  const saveMedicines = () => {
    const existing = localStorage.getItem("medbox_medicines");
    const existingMedicines = existing ? JSON.parse(existing) : [];
    const allMedicines = [...existingMedicines, ...medicines.filter((m) => m.name.trim())];
    localStorage.setItem("medbox_medicines", JSON.stringify(allMedicines));
    navigate("/vault");
  };

  const validMedicines = medicines.filter((m) => m.name.trim());

  // Calculate course progress (example: based on days completed)
  const calculateProgress = (medicine: Medicine) => {
    // For demo, show random progress. In real app, track actual progress
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
      <div className="max-w-2xl mx-auto p-6 space-y-6 animate-fade-in">
        {/* Top Level Tabs - Medicine & Course */}
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-auto p-2 bg-card">
            <TabsTrigger value="medicine" className="flex flex-col items-center gap-2 py-3">
              <Package className="w-5 h-5" />
              <span className="text-xs">{t("medicine")}</span>
            </TabsTrigger>
            <TabsTrigger value="course" className="flex flex-col items-center gap-2 py-3">
              <Activity className="w-5 h-5" />
              <span className="text-xs">Course</span>
            </TabsTrigger>
          </TabsList>

          {/* Medicine Tab Content */}
          <TabsContent value="medicine" className="space-y-6">
            {/* Show added medicines list */}
            {validMedicines.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Added Medicines</h3>
                {validMedicines.map((medicine, index) => {
                  const MedicineIcon = getMedicineIcon(medicine.type);
                  return (
                    <Card key={index} className="p-3 rounded-xl bg-card border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <MedicineIcon className="w-5 h-5 text-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{medicine.type}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Add Medicine Form Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-2 bg-card">
                <TabsTrigger value="medicine" disabled={activeTab !== "medicine"} className="flex flex-col items-center gap-2 py-3">
                  <Pill className="w-5 h-5" />
                  <span className="text-xs">Details</span>
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
                          value={medicine.perServing}
                          onChange={(e) => updateMedicine(index, "perServing", parseInt(e.target.value) || 1)}
                          className="h-12 flex-1 bg-card border-border"
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
                          value={medicine.timesPerDay}
                          onChange={(e) => updateMedicine(index, "timesPerDay", parseInt(e.target.value) || 1)}
                          className="h-12 flex-1 bg-card border-border"
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

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => adjustValue(index, "days", false)}
                          className="w-8 h-8 rounded-full bg-[hsl(20,25%,25%)] flex items-center justify-center text-white hover:opacity-90 shrink-0"
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
                          className="w-8 h-8 rounded-full bg-[hsl(20,25%,25%)] flex items-center justify-center text-white hover:opacity-90 shrink-0"
                        >
                          <span className="text-lg font-medium">+</span>
                        </button>
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap w-32 text-right">{t("days")}</span>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <MedicineIcon className="w-5 h-5 text-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{medicine.name || "Medicine"}</p>
                            <p className="text-sm text-muted-foreground">
                              {medicine.perServing} {getTypeLabel(medicine.type, medicine.perServing)}, {getTimesLabel(medicine.timesPerDay)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => openTimePicker(index)}
                          className="px-4 py-2 rounded-full text-sm font-medium bg-[hsl(20,25%,25%)] text-white hover:opacity-90 transition-all"
                        >
                          {formatTime(medicine.scheduleTime)}
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="ailment" className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground text-center">{t("whatAreYouTakingThisFor")}</h2>

                <div className="space-y-2">
                  <Input placeholder="Fever, Jaundice, Headache Etc" className="h-12 bg-card border-border" />
                  <p className="text-xs text-muted-foreground">{t("weWontShareThis")}</p>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Course Tab Content */}
          <TabsContent value="course" className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground text-center">Your Medicine Courses</h3>
            
            {validMedicines.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No medicines added yet</p>
                <Button 
                  variant="gradient" 
                  className="mt-4 rounded-full"
                  onClick={() => setMainTab("medicine")}
                >
                  Add Medicine
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {validMedicines.map((medicine, index) => {
                  const MedicineIcon = getMedicineIcon(medicine.type);
                  const progress = Math.min(100, Math.floor((index + 1) * 25)); // Demo progress
                  return (
                    <Card key={index} className="p-4 rounded-xl bg-card border-border">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <MedicineIcon className="w-5 h-5 text-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{medicine.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {medicine.days} day course • {getTimesLabel(medicine.timesPerDay)}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Started</span>
                          <span>{medicine.days - Math.floor(medicine.days * progress / 100)} days remaining</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                {/* Overall Progress */}
                <Card className="p-4 rounded-xl bg-secondary/50 border-border mt-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground text-center">Overall Course Progress</h4>
                    <Progress 
                      value={validMedicines.reduce((acc, _, i) => acc + Math.min(100, (i + 1) * 25), 0) / validMedicines.length} 
                      className="h-3" 
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      {validMedicines.length} active {validMedicines.length === 1 ? 'course' : 'courses'}
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Bottom Buttons - Always visible */}
        {mainTab === "medicine" && (
          <div className="fixed bottom-24 left-0 right-0 px-6">
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
                onClick={() => {
                  if (activeTab === "medicine") setActiveTab("schedule");
                  else if (activeTab === "schedule") setActiveTab("ailment");
                  else saveMedicines();
                }}
              >
                {activeTab === "ailment" ? t("confirm") : t("next")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <TimePickerDialog
        open={timePickerOpen}
        onOpenChange={setTimePickerOpen}
        onTimeSelect={handleTimeSelect}
        initialHour={medicines[selectedMedicineIndex]?.scheduleTime?.hour || 8}
        initialMinute={medicines[selectedMedicineIndex]?.scheduleTime?.minute || 0}
        initialPeriod={medicines[selectedMedicineIndex]?.scheduleTime?.period || "AM"}
      />

      <BottomNav />
    </div>
  );
};

export default AddMedicine;
