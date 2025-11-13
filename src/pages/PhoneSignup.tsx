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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-card rounded-xl p-8 shadow-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Sign up with phone
            </h2>
            <p className="text-muted-foreground">
              We'll send you a verification code
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Mobile Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="h-12 rounded-xl"
                maxLength={10}
              />
            </div>

            <Button
              onClick={handleSendOTP}
              size="lg"
              className="w-full h-12 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Send OTP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneSignup;
