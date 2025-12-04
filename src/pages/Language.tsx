import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const languages = [
  { value: "english", label: "English", native: "English" },
  { value: "hindi", label: "Hindi", native: "हिन्दी" },
  { value: "bengali", label: "Bengali", native: "বাংলা" },
  { value: "gujarati", label: "Gujarati", native: "ગુજરાતી" },
  { value: "tamil", label: "Tamil", native: "தமிழ்" },
  { value: "telugu", label: "Telugu", native: "తెలుగు" },
];

const Language = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  useEffect(() => {
    const saved = localStorage.getItem("medbox_language");
    if (saved) setSelectedLanguage(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem("medbox_language", selectedLanguage);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      <div className="max-w-2xl mx-auto p-6 space-y-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-card"
            style={{
              background: 'linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, hsl(350, 60%, 70%), hsl(25, 80%, 65%), hsl(35, 40%, 85%)) border-box',
              border: '2px solid transparent'
            }}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Select Language</h1>
        </div>

        <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage} className="space-y-3">
          {languages.map((lang) => (
            <div
              key={lang.value}
              className="flex items-center space-x-4 p-4 rounded-xl bg-card border border-border cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => setSelectedLanguage(lang.value)}
            >
              <RadioGroupItem value={lang.value} id={lang.value} />
              <Label htmlFor={lang.value} className="flex-1 cursor-pointer">
                <span className="text-foreground font-medium">{lang.native}</span>
                <span className="text-muted-foreground ml-2">({lang.label})</span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          variant="gradient"
          className="w-full rounded-full h-12"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Language;
