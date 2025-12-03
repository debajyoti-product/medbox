import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const Vault = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
      <div className="max-w-2xl mx-auto p-6 animate-fade-in flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h1 className="text-3xl font-light text-muted-foreground/50">
            No Medicines Added Yet
          </h1>
          
          <Button
            onClick={() => navigate("/add-medicine")}
            variant="gradient"
            className="flex items-center gap-2 font-medium rounded-full px-8 py-3 h-12"
          >
            <Plus className="w-5 h-5" />
            <span>Add Medicine</span>
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Vault;
