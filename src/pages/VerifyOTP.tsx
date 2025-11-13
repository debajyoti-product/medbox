import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const phone = localStorage.getItem("medbox_phone") || "";

  const handleVerify = () => {
    if (otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit code",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, accept any 4-digit code
    toast({
      title: "Verification successful",
      description: "Welcome to MedBox!",
    });
    
    // Clear stored phone
    localStorage.removeItem("medbox_phone");
    
    // Navigate to home (to be built)
    navigate("/home");
  };

  const handleResend = () => {
    toast({
      title: "OTP Resent",
      description: "A new code has been sent to your phone",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <button
          onClick={() => navigate("/signup")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-card rounded-xl p-8 shadow-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Verify your phone
            </h2>
            <p className="text-muted-foreground">
              We sent a 4-digit code to {phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-14 h-14 text-xl rounded-xl" />
                  <InputOTPSlot index={1} className="w-14 h-14 text-xl rounded-xl" />
                  <InputOTPSlot index={2} className="w-14 h-14 text-xl rounded-xl" />
                  <InputOTPSlot index={3} className="w-14 h-14 text-xl rounded-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerify}
              size="lg"
              className="w-full h-12 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Verify
            </Button>

            <div className="text-center">
              <Button
                onClick={handleResend}
                variant="link"
                className="text-primary"
              >
                Resend Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
