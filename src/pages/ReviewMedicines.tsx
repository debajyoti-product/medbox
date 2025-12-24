import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  Pill, 
  Droplets, 
  Syringe, 
  Wind, 
  Eye, 
  CircleDot, 
  Check, 
  X, 
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedicines } from "@/hooks/useMedicines";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ExtractedMedicine = {
  name: string;
  strength?: string;
  type: string;
  dosage: string | number;
  frequency: string | number;
  duration: string | number;
  accurate?: boolean;
  warning?: string | null;
};

const getMedicineIcon = (type: string) => {
  const iconClass = "w-5 h-5";
  switch (type?.toLowerCase()) {
    case "tablet":
      return <Pill className={iconClass} />;
    case "capsule":
      return <CircleDot className={iconClass} />;
    case "syrup":
    case "liquid":
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

const getIconBgColor = (type: string, isSelected: boolean) => {
  if (!isSelected) return "bg-muted/50 text-muted-foreground";
  
  switch (type?.toLowerCase()) {
    case "syrup":
    case "liquid":
      return "bg-blue-100 text-blue-600";
    case "injection":
      return "bg-purple-100 text-purple-600";
    case "inhaler":
      return "bg-teal-100 text-teal-600";
    case "drops":
      return "bg-amber-100 text-amber-600";
    case "capsule":
      return "bg-green-100 text-green-600";
    default:
      return "bg-primary/15 text-primary";
  }
};

const formatFrequency = (freq: string | number) => {
  if (typeof freq === "string") return freq;
  if (freq === 1) return "Once daily";
  if (freq === 2) return "Twice daily";
  if (freq === 3) return "Thrice daily";
  return `${freq} times daily`;
};

const formatDuration = (days: string | number) => {
  if (typeof days === "string") return days;
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const medicines: ExtractedMedicine[] = location.state?.medicines || [];

  // Initialize all medicines as selected on mount
  useEffect(() => {
    const allSelected = new Set(medicines.map((_, index) => index));
    setSelectedMedicines(allSelected);
  }, [medicines.length]);

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
      name: med.name + (med.strength && med.strength !== "cannot identify" && med.strength !== "unknown" ? ` ${med.strength}` : ""),
      type: med.type?.toLowerCase() || "tablet",
      perServing: typeof med.dosage === "number" ? med.dosage : 1,
      timesPerDay: typeof med.frequency === "number" ? med.frequency : 
        (typeof med.frequency === "string" && med.frequency.includes("1-0-1") ? 2 :
         typeof med.frequency === "string" && med.frequency.includes("1-1-1") ? 3 : 1),
      days: typeof med.duration === "number" ? med.duration : 
        (typeof med.duration === "string" ? parseInt(med.duration) || 7 : 7),
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
      setSavedCount(selectedList.length);
      setShowSuccessModal(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate("/vault");
  };

  if (medicines.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b border-border/30">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Review Medicines</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-xs">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium text-foreground">No Medicines Found</h2>
            <p className="text-muted-foreground text-sm">
              We couldn't find any medicines in your prescription. Try taking a clearer photo or add medicines manually.
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => navigate("/home")} className="flex-1">
                Try Again
              </Button>
              <Button onClick={() => navigate("/add-medicine")} className="flex-1">
                Add Manually
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/30 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Review Medicines</h1>
            <p className="text-xs text-muted-foreground">
              {selectedMedicines.size} of {medicines.length} selected
            </p>
          </div>
        </div>
      </div>

      {/* Medicine List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        <div className="space-y-3">
          {medicines.map((medicine, index) => {
            const isSelected = selectedMedicines.has(index);
            const hasWarning = medicine.accurate === false || medicine.warning;
            const cannotIdentify = medicine.name === "cannot identify";

            return (
              <button
                key={index}
                onClick={() => !cannotIdentify && toggleMedicine(index)}
                disabled={cannotIdentify}
                className={`w-full rounded-2xl transition-all duration-200 text-left overflow-hidden ${
                  cannotIdentify
                    ? "bg-muted/20 opacity-50 cursor-not-allowed"
                    : isSelected
                    ? "bg-card border border-primary/20 shadow-sm"
                    : "bg-muted/30 border border-transparent"
                } ${hasWarning && isSelected ? "ring-1 ring-amber-200" : ""}`}
              >
                {/* Warning Badge */}
                {hasWarning && !cannotIdentify && (
                  <div className="bg-amber-50 border-b border-amber-100 px-4 py-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span className="text-xs text-amber-700 font-medium">Needs verification</span>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${getIconBgColor(medicine.type, isSelected)}`}>
                      {getMedicineIcon(medicine.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-medium text-foreground text-sm leading-tight truncate">
                            {medicine.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            {medicine.strength && medicine.strength !== "cannot identify" && medicine.strength !== "unknown" && (
                              <span className="text-xs text-primary font-medium">
                                {medicine.strength}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded capitalize">
                              {medicine.type || "tablet"}
                            </span>
                          </div>
                        </div>

                        {/* Checkbox */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 border-2 border-muted-foreground/30"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      {/* Dosage Info */}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatFrequency(medicine.frequency)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDuration(medicine.duration)}
                        </span>
                      </div>

                      {/* Warning Message */}
                      {medicine.warning && (
                        <p className="mt-2 text-xs text-amber-600 leading-relaxed">
                          {medicine.warning}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/30 p-4 safe-area-inset-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate("/home")}
            className="flex-1 h-12 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={saving || selectedMedicines.size === 0}
            className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm ({selectedMedicines.size})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[340px] rounded-3xl border-0 bg-card p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 pt-8 pb-6 px-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            
            <DialogHeader className="text-center space-y-1">
              <DialogTitle className="text-xl font-semibold text-foreground">
                Medicines Added!
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {savedCount} medicine{savedCount > 1 ? "s have" : " has"} been saved to your vault
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 pt-4 space-y-3">
            <p className="text-xs text-muted-foreground text-center">
              You'll receive reminders at the scheduled times to help you stay on track.
            </p>
            
            <Button 
              onClick={handleSuccessClose}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              View My Medicines
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewMedicines;
