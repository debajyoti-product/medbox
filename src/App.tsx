import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "@/hooks/useTranslation";
import Welcome from "./pages/Welcome";
import PhoneSignup from "./pages/PhoneSignup";
import VerifyOTP from "./pages/VerifyOTP";
import NameEntry from "./pages/NameEntry";
import Home from "./pages/Home";
import AddMedicine from "./pages/AddMedicine";
import VoiceRecording from "./pages/VoiceRecording";
import Vault from "./pages/Vault";
import Profile from "./pages/Profile";
import Language from "./pages/Language";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TranslationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/signup" element={<PhoneSignup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/name-entry" element={<NameEntry />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add-medicine" element={<AddMedicine />} />
            <Route path="/voice-recording" element={<VoiceRecording />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/language" element={<Language />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TranslationProvider>
  </QueryClientProvider>
);

export default App;
