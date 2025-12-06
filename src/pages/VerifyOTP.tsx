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
        description: "Please Enter A Valid 4-Digit Code",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, accept any 4-digit code
    toast({
      title: "Verification Successful",
      description: "Welcome To MedBox!",
    });
    
    // Clear stored phone
    localStorage.removeItem("medbox_phone");
    
    // Navigate to name entry screen
    navigate("/name-entry");
  };

  const handleResend = () => {
    toast({
      title: "OTP Resent",
      description: "A New Code Has Been Sent To Your Phone",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex flex-col p-6 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-between max-w-md w-full mx-auto">
        <div className="space-y-8 text-center w-full pt-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Verify Your Phone
            </h2>
            <p className="text-muted-foreground">
              We Sent A 4-Digit Code To {phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup className="gap-4">
                  <InputOTPSlot index={0} className="w-14 h-14 text-xl rounded-xl bg-card border-border" />
                  <InputOTPSlot index={1} className="w-14 h-14 text-xl rounded-xl bg-card border-border" />
                  <InputOTPSlot index={2} className="w-14 h-14 text-xl rounded-xl bg-card border-border" />
                  <InputOTPSlot index={3} className="w-14 h-14 text-xl rounded-xl bg-card border-border" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="text-center">
              <Button
                onClick={handleResend}
                variant="link"
                className="text-accent"
              >
                Resend Code
              </Button>
            </div>
          </div>
        </div>

        <Button
          onClick={handleVerify}
          size="lg"
          variant="gradient"
          className="w-full text-base h-12 rounded-full font-medium"
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default VerifyOTP;
