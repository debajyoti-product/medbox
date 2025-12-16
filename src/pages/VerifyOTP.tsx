import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyOtp, sendOtp } = useAuth();
  const phone = localStorage.getItem("medbox_phone") || "";

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please Enter A Valid 6-Digit Code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error, isNewUser } = await verifyOtp(phone, otp);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid Code. Please Try Again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Verification Successful",
      description: "Welcome To MedBox!",
    });
    
    // Clear stored phone
    localStorage.removeItem("medbox_phone");
    
    // Navigate to name entry if new user, otherwise to home
    if (isNewUser) {
      navigate("/name-entry");
    } else {
      navigate("/home");
    }
  };

  const handleResend = async () => {
    if (!phone) {
      toast({
        title: "Error",
        description: "Please Go Back And Enter Your Phone Number",
        variant: "destructive",
      });
      return;
    }

    const { error } = await sendOtp(phone);
    
    if (error) {
      toast({
        title: "Error Sending OTP",
        description: error.message || "Please Try Again",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "OTP Resent",
      description: "A New Code Has Been Sent To Your Phone",
    });
  };

  const formatPhone = (phone: string) => {
    if (phone.startsWith("+91")) {
      const number = phone.slice(3);
      return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
    }
    return phone;
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
              We Sent A 6-Digit Code To {formatPhone(phone)}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl rounded-xl bg-card border-border" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl rounded-xl bg-card border-border" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl rounded-xl bg-card border-border" />
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl rounded-xl bg-card border-border" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl rounded-xl bg-card border-border" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl rounded-xl bg-card border-border" />
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
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyOTP;
