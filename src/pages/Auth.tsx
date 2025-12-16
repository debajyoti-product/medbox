import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please Enter A Valid Email Address"),
  password: z.string().min(6, "Password Must Be At Least 6 Characters"),
  name: z.string().min(1, "Please Enter Your Name").optional(),
});

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signIn, user } = useAuth();
  const [autoplay] = useState(() => Autoplay({ delay: 3000 }));
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleSubmit = async () => {
    try {
      const validationData = isSignUp 
        ? { email, password, name } 
        : { email, password };
      
      const result = authSchema.safeParse(validationData);
      
      if (!result.success) {
        const error = result.error.errors[0];
        toast({
          title: "Validation Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);

      if (isSignUp) {
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account Exists",
              description: "This Email Is Already Registered. Please Sign In.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign Up Failed",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }
        toast({
          title: "Welcome To MedBox!",
          description: "Your Account Has Been Created Successfully",
        });
        navigate("/home");
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign In Failed",
            description: "Invalid Email Or Password",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Welcome Back!",
          description: "You Have Been Signed In Successfully",
        });
        navigate("/home");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something Went Wrong. Please Try Again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex flex-col p-6 animate-fade-in">
      <div className="flex-1 flex flex-col max-w-md w-full mx-auto pt-8">
        {/* Image Carousel */}
        <div className="mb-6 relative flex items-center justify-center">
          <div className="relative w-full">
            <Carousel
              setApi={setApi}
              plugins={[autoplay]}
              className="w-full h-full"
              opts={{ loop: true }}
            >
              <CarouselContent>
                {[
                  { image: voiceSetup, text: "Add Medicine Via Voice Or Text" },
                  { image: reminders, text: "Daily Notifications For Your Doses" },
                  { image: progress, text: "Track Medication Courses Regularly" }
                ].map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full flex flex-col items-center justify-center">
                      <img 
                        src={item.image} 
                        alt={item.text} 
                        className="w-full max-w-sm h-auto object-contain"
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

        {/* Auth Form */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-normal text-foreground block text-left">
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="What Should We Call You?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl placeholder:text-muted-foreground/40 bg-card border-border"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-normal text-foreground block text-left">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl placeholder:text-muted-foreground/40 bg-card border-border"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-normal text-foreground block text-left">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl placeholder:text-muted-foreground/40 bg-card border-border"
            />
          </div>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-accent hover:underline text-center"
          >
            {isSignUp ? "Already Have An Account? Sign In" : "Don't Have An Account? Sign Up"}
          </button>
        </div>

        {/* CTA at bottom */}
        <Button
          onClick={handleSubmit}
          size="lg"
          variant="gradient"
          className="w-full text-base h-12 rounded-full font-medium mt-6"
          disabled={isLoading}
        >
          {isLoading ? "Please Wait..." : isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </div>
    </div>
  );
};

export default Auth;
