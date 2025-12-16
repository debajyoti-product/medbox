import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useMedicines } from "@/hooks/useMedicines";

const Search = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { medicines, loading: medicinesLoading } = useMedicines();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signup");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Auto-focus the input to enable keyboard
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {searchQuery && filteredMedicines.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No Medicines Found
            </p>
          )}
          {filteredMedicines.map((medicine) => (
            <div
              key={medicine.id}
              className="p-4 bg-card rounded-xl border border-border"
            >
              <p className="font-medium text-foreground">{medicine.name}</p>
              <p className="text-sm text-muted-foreground">
                {medicine.perServing} {medicine.type}, {medicine.timesPerDay}x daily
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Search;
