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
    <div className="min-h-screen bg-background flex flex-col p-6 animate-fade-in">
      <button
        onClick={() => navigate("/signup")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-between max-w-md w-full mx-auto">
        <div className="space-y-8 text-center w-full pt-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
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

        <Button
          onClick={handleVerify}
          size="lg"
          variant="glass"
          className="w-full text-base h-12 rounded-full font-medium bg-[#90EE90]/20 hover:bg-[#90EE90]/30 backdrop-blur-md border border-[#90EE90]/30"
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default VerifyOTP;
