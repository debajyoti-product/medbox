import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import voiceSetup from "@/assets/illustration-voice-setup.png";
import reminders from "@/assets/illustration-reminders.png";
import progress from "@/assets/illustration-progress.png";

const PhoneSignup = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [autoplay] = useState(() => Autoplay({ delay: 3000 }));
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleSendOTP = () => {
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please Enter A Valid 10-Digit Mobile Number",
        variant: "destructive",
      });
      return;
    }

    // Store phone for verification screen
    localStorage.setItem("medbox_phone", phone);
    
    toast({
      title: "OTP Sent",
      description: "Please Check Your Phone For The Verification Code",
    });
    
    navigate("/verify-otp");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex flex-col p-6 animate-fade-in">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
        {/* Stacked Card Carousel */}
        <div className="mb-8 relative flex items-center justify-center">
          <div className="relative w-64 h-72">
            <Carousel
              setApi={setApi}
              plugins={[autoplay]}
              className="w-full h-full"
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {[voiceSetup, reminders, progress].map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-72 flex items-center justify-center">
                      {/* Background stacked cards */}
                      <div className="absolute w-52 h-60 bg-card/60 rounded-2xl transform rotate-6 translate-x-4 shadow-[0_8px_30px_rgba(255,255,255,0.1)]"></div>
                      <div className="absolute w-52 h-60 bg-card/40 rounded-2xl transform -rotate-6 -translate-x-4 shadow-[0_8px_30px_rgba(255,255,255,0.1)]"></div>
                      
                      {/* Main card */}
                      <div className="relative w-56 h-64 bg-card rounded-2xl shadow-[0_8px_40px_rgba(255,255,255,0.15)] border border-border/30 overflow-hidden flex items-center justify-center p-4">
                        <img 
                          src={image} 
                          alt={`Feature ${index + 1}`} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        
        {/* Scroll indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                current === index ? "w-6 bg-gradient-to-r from-accent to-[hsl(320,70%,55%)]" : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Text and input fields moved lower */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-normal text-foreground block text-left">
              Enter Your Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter Your 10-Digit Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="h-12 rounded-xl placeholder:text-muted-foreground/40 bg-card border-border"
              maxLength={10}
            />
          </div>
        </div>

        {/* CTA at bottom */}
        <Button
          onClick={handleSendOTP}
          size="lg"
          variant="gradient"
          className="w-full text-base h-12 rounded-full font-medium mt-6"
        >
          Send OTP
        </Button>
      </div>
    </div>
  );
};

export default PhoneSignup;
