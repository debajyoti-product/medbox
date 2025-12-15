import { useNavigate } from "react-router-dom";
import { Plus, Pill, CircleDot, Syringe, Wind, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";

type Medicine = {
  name: string;
  type: string;
  perServing: number;
  timesPerDay: number;
  days: number;
  startDate?: string;
};

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

const Vault = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("medbox_medicines");
    if (saved) {
      setMedicines(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
      <div className="max-w-2xl mx-auto p-6 animate-fade-in">
        {medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center">
            <h1 className="text-3xl font-light text-muted-foreground/50">
              {t("noMedicinesAdded")}
            </h1>
            
            <Button
              onClick={() => navigate("/add-medicine")}
              className="flex items-center gap-2 font-medium rounded-full px-8 py-3 h-12 bg-card text-foreground hover:bg-card/80 transition-all"
              style={{
                background: 'linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, hsl(350, 60%, 70%), hsl(25, 80%, 65%), hsl(35, 40%, 85%)) border-box',
                border: '2px solid transparent'
              }}
            >
              <Plus className="w-5 h-5" />
              <span>{t("addMedicine")}</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {medicines.map((medicine, index) => {
              const MedicineIcon = getMedicineIcon(medicine.type);
              return (
                <Card key={index} className="p-4 rounded-xl bg-card border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
                      <MedicineIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground">{medicine.name}</h3>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Vault;
