import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NameEntry = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please Enter Your Name To Continue",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("medbox_username", name.trim());
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex flex-col p-6 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-between max-w-md w-full mx-auto">
        <div className="space-y-12 text-center w-full pt-24">
          <h2 className="text-2xl font-semibold text-foreground">
            What Should We Call You?
          </h2>

          <div className="relative w-full">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Name"
              className="w-full bg-transparent text-center text-xl text-foreground placeholder:text-muted-foreground focus:outline-none pb-3"
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          size="lg"
          variant="gradient"
          className="w-full text-base h-12 rounded-full font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default NameEntry;
