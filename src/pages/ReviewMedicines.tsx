import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Pill, Droplets, Syringe, Wind, Eye, CircleDot, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedicines } from "@/hooks/useMedicines";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

type ExtractedMedicine = {
  name: string;
  strength: string;
  type: string;
  dosage: number;
  frequency: number;
  duration: number;
};

const getMedicineIcon = (type: string) => {
  const iconClass = "w-5 h-5";
  switch (type?.toLowerCase()) {
    case "tablet":
      return <Pill className={iconClass} />;
    case "capsule":
      return <CircleDot className={iconClass} />;
    case "syrup":
      return <Droplets className={iconClass} />;
    case "injection":
      return <Syringe className={iconClass} />;
    case "drops":
      return <Eye className={iconClass} />;
    case "inhaler":
      return <Wind className={iconClass} />;
    default:
      return <Pill className={iconClass} />;
  }
};

const formatFrequency = (freq: number) => {
  if (freq === 1) return "Once daily";
  if (freq === 2) return "Twice daily";
  if (freq === 3) return "Thrice daily";
  return `${freq} times daily`;
};

const formatDuration = (days: number) => {
  if (days === 1) return "1 day";
  if (days === 7) return "1 week";
  if (days === 14) return "2 weeks";
  if (days === 30) return "1 month";
  return `${days} days`;
};

const ReviewMedicines = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addMedicines } = useMedicines();
  const [saving, setSaving] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState<Set<number>>(new Set());

  const medicines: ExtractedMedicine[] = location.state?.medicines || [];

  // Initialize all medicines as selected
  useState(() => {
    const allSelected = new Set(medicines.map((_, index) => index));
    setSelectedMedicines(allSelected);
  });

  const toggleMedicine = (index: number) => {
    const newSelected = new Set(selectedMedicines);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedMedicines(newSelected);
  };

  const handleConfirm = async () => {
    const selectedList = medicines.filter((_, index) => selectedMedicines.has(index));
    
    if (selectedList.length === 0) {
      toast({
        title: "No medicines selected",
        description: "Please select at least one medicine to save.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    const formattedMedicines = selectedList.map((med) => ({
      name: med.name + (med.strength && med.strength !== "cannot identify" ? ` ${med.strength}` : ""),
      type: med.type?.toLowerCase() || "tablet",
      perServing: typeof med.dosage === "number" ? med.dosage : 1,
      timesPerDay: typeof med.frequency === "number" ? med.frequency : 1,
      days: typeof med.duration === "number" ? med.duration : 7,
    }));

    const { error } = await addMedicines(formattedMedicines);
    
    setSaving(false);
    
    if (error) {
      toast({
        title: "Error saving medicines",
        description: "Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Medicines saved!",
        description: `${selectedList.length} medicine(s) added to your vault.`,
      });
      navigate("/vault");
    }
  };

  if (medicines.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col">
        <div className="p-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Review Medicines</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium text-foreground">No medicines found</h2>
            <p className="text-muted-foreground text-sm">
              Could not extract medicines from the image. Please try again or add manually.
            </p>
            <Button onClick={() => navigate("/add-medicine")} className="mt-4">
              Add Manually
            </Button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col pb-24">
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Review Medicines</h1>
          <p className="text-sm text-muted-foreground">Tap to select or deselect</p>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-3 overflow-y-auto">
        {medicines.map((medicine, index) => {
          const isSelected = selectedMedicines.has(index);
          const cannotIdentify = medicine.name === "cannot identify";

          return (
            <button
              key={index}
              onClick={() => !cannotIdentify && toggleMedicine(index)}
              disabled={cannotIdentify}
              className={`w-full p-4 rounded-2xl transition-all duration-200 text-left ${
                cannotIdentify
                  ? "bg-muted/30 opacity-50 cursor-not-allowed"
                  : isSelected
                  ? "bg-primary/10 border-2 border-primary shadow-md"
                  : "bg-card border-2 border-transparent shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {getMedicineIcon(medicine.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {medicine.name}
                    </h3>
                    {medicine.strength && medicine.strength !== "cannot identify" && (
                      <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                        {medicine.strength}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {typeof medicine.dosage === "number" 
                      ? `${medicine.dosage} ${medicine.type || "dose"}` 
                      : medicine.type || "Medicine"} 
                    {" · "}
                    {formatFrequency(medicine.frequency)}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {formatDuration(medicine.duration)}
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          onClick={handleConfirm}
          disabled={saving || selectedMedicines.size === 0}
          className="w-full h-14 rounded-2xl text-lg font-medium shadow-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            `Confirm ${selectedMedicines.size} Medicine${selectedMedicines.size === 1 ? "" : "s"}`
          )}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ReviewMedicines;
