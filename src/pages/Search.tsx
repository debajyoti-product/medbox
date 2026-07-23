import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, ArrowLeft, Pill, CircleDot, Syringe, Droplets, Check, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useMedicines } from "@/hooks/useMedicines";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CatalogMedicine {
  id: number;
  name: string;
  price: number | null;
  pack_size_label: string | null;
  short_composition: string | null;
}

interface SelectedMedicine {
  name: string;
  type: string;
}

const getMedicineType = (packSizeLabel: string | null): string => {
  if (!packSizeLabel) return "tablet";
  const label = packSizeLabel.toLowerCase();
  if (label.includes("capsule")) return "capsule";
  if (label.includes("injection") || label.includes("vial")) return "injection";
  if (label.includes("syrup") || label.includes("liquid") || label.includes("ml")) return "syrup";
  return "tablet";
};

const getMedicineIcon = (type: string) => {
  switch (type) {
    case "capsule": return CircleDot;
    case "injection": return Syringe;
    case "syrup": return Droplets;
    default: return Pill;
  }
};

const Search = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { medicines: existingMedicines } = useMedicines();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<CatalogMedicine[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Full name popup state
  const [fullNamePopup, setFullNamePopup] = useState<{ open: boolean; name: string }>({
    open: false,
    name: "",
  });

  // Duplicate warning dialog state
  const [duplicateWarning, setDuplicateWarning] = useState<{
    open: boolean;
    medicine: CatalogMedicine | null;
    matchedName: string;
  }>({ open: false, medicine: null, matchedName: "" });

  useEffect(() => {
    // Auth redirect disabled for preview
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data, error } = await supabase
          .from("medicine_catalog")
          .select("*")
          .ilike("name", `%${searchQuery}%`)
          .limit(20);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const isSelected = (medicine: CatalogMedicine) => {
    return selectedMedicines.some((m) => m.name === medicine.name);
  };

  const checkForDuplicate = (medicineName: string): string | null => {
    const searchName = medicineName.toLowerCase().trim();
    for (const existing of existingMedicines) {
      const existingName = existing.name.toLowerCase().trim();
      // Check if either name contains the other or they're similar
      if (searchName.includes(existingName) || existingName.includes(searchName) || searchName === existingName) {
        return existing.name;
      }
    }
    return null;
  };

  const handleAddClick = (medicine: CatalogMedicine) => {
    if (isSelected(medicine)) {
      // Remove if already selected
      setSelectedMedicines(selectedMedicines.filter((m) => m.name !== medicine.name));
      return;
    }

    // Check for duplicate in existing medicines
    const matchedName = checkForDuplicate(medicine.name);
    if (matchedName) {
      setDuplicateWarning({ open: true, medicine, matchedName });
    } else {
      addMedicine(medicine);
    }
  };

  const addMedicine = (medicine: CatalogMedicine) => {
    const type = getMedicineType(medicine.pack_size_label);
    setSelectedMedicines([...selectedMedicines, { name: medicine.name, type }]);
  };

  const handleCardTap = (medicineName: string) => {
    setFullNamePopup({ open: true, name: medicineName });
  };

  const handleContinue = () => {
    navigate("/add-medicine", { state: { preselectedMedicines: selectedMedicines } });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-40">
      <div className="max-w-2xl mx-auto p-6 space-y-6 animate-fade-in">
        {/* Search Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search Your Medicines Here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 bg-card border-border rounded-full"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-3">
          {searching && (
            <p className="text-center text-muted-foreground py-4">Searching...</p>
          )}
          {!searching && searchQuery && results.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No Medicines Found
            </p>
          )}
          {results.map((medicine) => {
            const type = getMedicineType(medicine.pack_size_label);
            const Icon = getMedicineIcon(type);
            const selected = isSelected(medicine);

            return (
              <div
                key={medicine.id}
                className="p-4 bg-card rounded-xl border border-border flex items-center justify-between gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => handleCardTap(medicine.name)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{medicine.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {medicine.pack_size_label || "Tablet"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddClick(medicine);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                    selected
                      ? "bg-[hsl(20,25%,25%)] text-white"
                      : "bg-card text-foreground"
                  }`}
                  style={
                    !selected
                      ? {
                          background: "linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, hsl(350, 60%, 70%), hsl(25, 80%, 65%), hsl(35, 40%, 85%)) border-box",
                          border: "2px solid transparent",
                        }
                      : undefined
                  }
                >
                  {selected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added
                    </>
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-32 left-0 right-0 px-6">
        <div className="max-w-2xl mx-auto bg-background pt-4 pb-2 px-4 rounded-t-2xl space-y-2">
          <p className="text-center text-xs text-muted-foreground">
            Tap on a medicine card to view full name
          </p>
          <Button
            variant="gradient"
            className="w-full rounded-full h-12 shadow-sm"
            disabled={selectedMedicines.length === 0}
            onClick={handleContinue}
          >
            Continue ({selectedMedicines.length})
          </Button>
        </div>
      </div>

      {/* Full Name Popup Dialog */}
      <Dialog open={fullNamePopup.open} onOpenChange={(open) => setFullNamePopup({ ...fullNamePopup, open })}>
        <DialogContent className="max-w-sm w-[calc(100%-2rem)] bg-card/95 backdrop-blur-xl border-border rounded-3xl p-5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
          <DialogHeader>
            <DialogTitle className="text-base font-medium text-foreground">
              {fullNamePopup.name}
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Duplicate Warning Dialog */}
      <AlertDialog open={duplicateWarning.open} onOpenChange={(open) => setDuplicateWarning({ ...duplicateWarning, open })}>
        <AlertDialogContent className="max-w-sm w-[calc(100%-2rem)] bg-card/95 backdrop-blur-xl border-border rounded-3xl p-5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-foreground">
              Duplicate Medicine
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You're already taking <span className="font-semibold">{duplicateWarning.matchedName}</span>. Adding it again may risk overdose. Please consult a doctor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3">
            <AlertDialogCancel className="flex-1 m-0 bg-[hsl(20,25%,25%)] text-white hover:bg-[hsl(20,25%,30%)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 m-0 border border-border bg-transparent text-foreground hover:bg-secondary"
              onClick={() => {
                if (duplicateWarning.medicine) {
                  addMedicine(duplicateWarning.medicine);
                }
              }}
            >
              Add Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default Search;