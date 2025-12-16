import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, ArrowLeft, Pill, CircleDot, Syringe, Droplets, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<CatalogMedicine[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signup");
    }
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

  const toggleMedicine = (medicine: CatalogMedicine) => {
    const type = getMedicineType(medicine.pack_size_label);
    if (isSelected(medicine)) {
      setSelectedMedicines(selectedMedicines.filter((m) => m.name !== medicine.name));
    } else {
      setSelectedMedicines([...selectedMedicines, { name: medicine.name, type }]);
    }
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
                className="p-4 bg-card rounded-xl border border-border flex items-center justify-between gap-3"
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
                  onClick={() => toggleMedicine(medicine)}
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
        <div className="max-w-2xl mx-auto">
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

      <BottomNav />
    </div>
  );
};

export default Search;
