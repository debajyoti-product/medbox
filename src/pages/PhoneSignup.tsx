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
      <div className="flex-1 flex flex-col max-w-md w-full mx-auto pt-8">
        {/* Image Carousel */}
        <div className="mb-6 relative flex items-center justify-center">
          <div className="relative w-full h-64">
            <Carousel
              setApi={setApi}
              plugins={[autoplay]}
              className="w-full h-full"
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {[
                  { image: voiceSetup, text: "Add Medicine Via Voice Or Text" },
                  { image: reminders, text: "Daily Notifications For Your Doses" },
                  { image: progress, text: "Track Medication Courses Regularly" }
                ].map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-64 flex flex-col items-center justify-center">
                      <img 
                        src={item.image} 
                        alt={item.text} 
                        className="w-48 h-48 object-contain"
                      />
                      <p className="mt-2 text-sm font-medium text-foreground/80 text-center font-caslon">
                        {item.text}
                      </p>
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
                current === index ? "w-6 bg-gradient-to-r from-[hsl(350,60%,70%)] via-[hsl(25,80%,65%)] to-[hsl(35,40%,85%)]" : "w-2 bg-muted-foreground/30"
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
