import { useNavigate } from "react-router-dom";
import { User, Phone, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import GoogleTranslateIcon from "@/components/GoogleTranslateIcon";
import { useTranslation } from "@/hooks/useTranslation";

const Profile = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const userName = localStorage.getItem("medbox_username") || "User";
  const userPhone = localStorage.getItem("medbox_phone") || "+91 XXXXXXXXXX";

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
          <h2 className="text-lg font-medium text-foreground">{t("personalInfo")}</h2>
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("name")}</p>
                <p className="text-foreground font-medium">{userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("phone")}</p>
                <p className="text-foreground font-medium">{userPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">{t("language")}</h2>
          <div
            onClick={() => navigate("/language")}
            className="bg-card rounded-xl border border-border p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <GoogleTranslateIcon className="text-muted-foreground" size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("language")}</p>
                <p className="text-foreground font-medium">{languages[language]}</p>
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
