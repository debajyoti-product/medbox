import { useNavigate } from "react-router-dom";
import { User, Phone, Globe, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("medbox_username") || "User";
  const userPhone = localStorage.getItem("medbox_phone") || "+91 XXXXXXXXXX";
  const selectedLanguage = localStorage.getItem("medbox_language") || "english";

  const languages: Record<string, string> = {
    english: "English",
    hindi: "हिन्दी (Hindi)",
    bengali: "বাংলা (Bengali)",
    gujarati: "ગુજરાતી (Gujarati)",
    tamil: "தமிழ் (Tamil)",
    telugu: "తెలుగు (Telugu)",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card pb-32">
      <div className="max-w-2xl mx-auto p-6 space-y-8 animate-fade-in">
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>

        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Personal Information</h2>
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-foreground font-medium">{userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="text-foreground font-medium">{userPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Language</h2>
          <div
            onClick={() => navigate("/language")}
            className="bg-card rounded-xl border border-border p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Globe className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">App Language</p>
                <p className="text-foreground font-medium">{languages[selectedLanguage]}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
