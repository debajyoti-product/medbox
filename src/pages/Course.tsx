import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Pill, CircleDot, Syringe, Wind, Droplets } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMedicines, type Medicine } from "@/hooks/useMedicines";

const medicineTypes = [
  { value: "tablet", icon: Pill },
  { value: "capsule", icon: CircleDot },
  { value: "injection", icon: Syringe },
  { value: "spray", icon: Wind },
  { value: "liquid", icon: Droplets },
];

const getMedicineIcon = (type: string) => {
  const found = medicineTypes.find((t) => t.value === type);
  return found ? found.icon : Pill;
};

const calculateDaysElapsed = (startDate?: string) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

const Course = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { medicines, loading: medicinesLoading } = useMedicines();
  const [courseFilter, setCourseFilter] = useState("active");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const calculateProgress = (medicine: Medicine) => {
    const elapsed = calculateDaysElapsed(medicine.startDate);
    return Math.min(100, Math.floor((elapsed / medicine.days) * 100));
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const progress = calculateProgress(medicine);
    if (courseFilter === "active") return progress < 100;
    return progress >= 100;
  });

  const loading = authLoading || medicinesLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
        <div className="max-w-2xl mx-auto p-6 animate-fade-in">
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
      <div className="max-w-2xl mx-auto p-6 animate-fade-in">
        {medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <h1 className="text-3xl font-light text-muted-foreground/50">
              No Courses Yet
            </h1>
            <p className="text-muted-foreground mt-2">
              Add medicines to see your courses here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-32 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredMedicines.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No {courseFilter} courses
                </p>
              </div>
            ) : (
              filteredMedicines.map((medicine) => {
                const MedicineIcon = getMedicineIcon(medicine.type);
                const progress = calculateProgress(medicine);
                const daysElapsed = calculateDaysElapsed(medicine.startDate);
                const daysRemaining = Math.max(0, medicine.days - daysElapsed);

                return (
                  <Card key={medicine.id} className="p-4 rounded-xl bg-card border-border">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <MedicineIcon className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {medicine.days} day course
                          </p>
                        </div>
                        <span className="text-sm font-medium text-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Day {daysElapsed + 1}</span>
                        <span>{daysRemaining} days remaining</span>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Course;
