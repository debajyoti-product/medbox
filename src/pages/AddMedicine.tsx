import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus } from "lucide-react";

type Medicine = {
  name: string;
  timesPerDay: number;
  days: number;
};

const AddMedicine = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("medicine");
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", timesPerDay: 0, days: 0 },
  ]);
  const [scheduleTime, setScheduleTime] = useState({ hour: 8, minute: 0, period: "AM" });

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", timesPerDay: 0, days: 0 }]);
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string | number) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const adjustValue = (index: number, field: "timesPerDay" | "days", increment: boolean) => {
    const current = medicines[index][field];
    const newValue = increment ? current + 1 : Math.max(0, current - 1);
    updateMedicine(index, field, newValue);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6 animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="medicine" disabled={activeTab !== "medicine"}>
              Medicine
            </TabsTrigger>
            <TabsTrigger value="schedule" disabled={activeTab === "medicine"}>
              Schedule
            </TabsTrigger>
            <TabsTrigger value="ailment" disabled={activeTab !== "ailment"}>
              Ailment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medicine" className="space-y-6">
            {medicines.map((medicine, index) => (
              <div key={index} className="space-y-4">
                <Input
                  placeholder="Medicine name"
                  value={medicine.name}
                  onChange={(e) => updateMedicine(index, "name", e.target.value)}
                  className="h-12"
                />

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="number"
                      value={medicine.timesPerDay || ""}
                      onChange={(e) => updateMedicine(index, "timesPerDay", parseInt(e.target.value) || 0)}
                      className="h-12 w-20 text-center"
                    />
                    <button
                      onClick={() => adjustValue(index, "timesPerDay", true)}
                      className="w-8 h-8 rounded-full bg-[#90EE90] flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-sm text-muted-foreground">times a day for</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={medicine.days || ""}
                      onChange={(e) => updateMedicine(index, "days", parseInt(e.target.value) || 0)}
                      className="h-12 w-20 text-center"
                    />
                    <button
                      onClick={() => adjustValue(index, "days", true)}
                      className="w-8 h-8 rounded-full bg-[#90EE90] flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
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

            <Button
              className="w-full rounded-full bg-[#90EE90] hover:bg-[#7FDD7F] text-white h-12"
              onClick={() => setActiveTab("schedule")}
            >
              Next
            </Button>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="p-6 rounded-xl shadow-md">
              <p className="text-sm text-foreground">
                {medicines[0]?.name || "Medicine"}, {medicines[0]?.timesPerDay || 0} times a day for {medicines[0]?.days || 0} days
              </p>
            </Card>

            <div className="flex items-center justify-center gap-4 p-8">
              <div className="flex flex-col items-center">
                <button onClick={() => setScheduleTime(prev => ({ ...prev, hour: prev.hour < 12 ? prev.hour + 1 : 1 }))}>
                  <Plus className="w-6 h-6" />
                </button>
                <span className="text-4xl font-semibold my-4">{scheduleTime.hour.toString().padStart(2, "0")}</span>
                <button onClick={() => setScheduleTime(prev => ({ ...prev, hour: prev.hour > 1 ? prev.hour - 1 : 12 }))}>
                  <Minus className="w-6 h-6" />
                </button>
              </div>

              <span className="text-4xl font-semibold">:</span>

              <div className="flex flex-col items-center">
                <button onClick={() => setScheduleTime(prev => ({ ...prev, minute: (prev.minute + 15) % 60 }))}>
                  <Plus className="w-6 h-6" />
                </button>
                <span className="text-4xl font-semibold my-4">{scheduleTime.minute.toString().padStart(2, "0")}</span>
                <button onClick={() => setScheduleTime(prev => ({ ...prev, minute: prev.minute >= 15 ? prev.minute - 15 : 45 }))}>
                  <Minus className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col items-center ml-4">
                <button 
                  onClick={() => setScheduleTime(prev => ({ ...prev, period: prev.period === "AM" ? "PM" : "AM" }))}
                  className="text-2xl font-semibold"
                >
                  {scheduleTime.period}
                </button>
              </div>
            </div>

            <Button
              className="w-full rounded-full bg-[#90EE90] hover:bg-[#7FDD7F] text-white h-12"
              onClick={() => setActiveTab("ailment")}
            >
              Next
            </Button>
          </TabsContent>

          <TabsContent value="ailment" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground text-center">
              What are you taking this for?
            </h2>

            <div className="space-y-2">
              <Input
                placeholder="fever, jaundice, headache etc"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                we won't share this with anyone
              </p>
            </div>

            <Button
              className="w-full rounded-full bg-[#90EE90] hover:bg-[#7FDD7F] text-white h-12"
              onClick={() => navigate("/home")}
            >
              Confirm
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AddMedicine;
