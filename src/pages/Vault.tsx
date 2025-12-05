import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import MedicineCard from "@/components/MedicineCard";
import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";

type Medicine = {
  name: string;
  type: string;
  perServing: number;
  timesPerDay: number;
  days: number;
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
            <h1 className="text-2xl font-semibold text-foreground mb-6">
              {t("medicine")}
            </h1>
            {medicines.map((medicine, index) => (
              <MedicineCard
                key={index}
                name={medicine.name}
                type={medicine.type}
                perServing={medicine.perServing}
                timesPerDay={medicine.timesPerDay}
              />
            ))}
            <Button
              onClick={() => navigate("/add-medicine")}
              className="w-full flex items-center gap-2 font-medium rounded-full px-8 py-3 h-12 bg-card text-foreground hover:bg-card/80 transition-all mt-6"
              style={{
                background: 'linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, hsl(350, 60%, 70%), hsl(25, 80%, 65%), hsl(35, 40%, 85%)) border-box',
                border: '2px solid transparent'
              }}
            >
              <Plus className="w-5 h-5" />
              <span>{t("addMedicine")}</span>
            </Button>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Vault;
