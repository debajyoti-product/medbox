import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PhoneSignup = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = () => {
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    // Store phone for verification screen
    localStorage.setItem("medbox_phone", phone);
    
    toast({
      title: "OTP Sent",
      description: "Please check your phone for the verification code",
    });
    
    navigate("/verify-otp");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 animate-fade-in">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-between max-w-md w-full mx-auto">
        <div className="space-y-6 text-center w-full pt-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Just one step
            </h2>
            <p className="text-muted-foreground">
              We'll send you a verification code
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground sr-only">
              Mobile Number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your 10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="h-12 rounded-xl placeholder:text-muted-foreground/50"
              maxLength={10}
            />
          </div>
        </div>

        <Button
          onClick={handleSendOTP}
          size="lg"
          variant="glass"
          className="w-full text-base h-12 rounded-full font-medium bg-[#90EE90]/20 hover:bg-[#90EE90]/30 backdrop-blur-md border border-[#90EE90]/30"
        >
          Send OTP
        </Button>
      </div>
    </div>
  );
};

export default PhoneSignup;
