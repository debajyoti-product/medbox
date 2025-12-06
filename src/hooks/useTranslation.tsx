import { useState, useEffect, createContext, useContext, ReactNode } from "react";

type TranslationKey = 
  | "hello"
  | "tellUsYourMedicine"
  | "addYourMedicineManually"
  | "or"
  | "noMedicinesAdded"
  | "addMedicine"
  | "selectLanguage"
  | "save"
  | "personalInfo"
  | "name"
  | "phone"
  | "language"
  | "medicine"
  | "schedule"
  | "ailment"
  | "perServing"
  | "timesADay"
  | "days"
  | "next"
  | "back"
  | "confirm"
  | "whatAreYouTakingThisFor"
  | "weWontShareThis"
  | "currentLanguage";

const translations: Record<string, Record<TranslationKey, string>> = {
  english: {
    hello: "Hello",
    tellUsYourMedicine: "Tell Us Your Medicine",
    addYourMedicineManually: "Add Your Medicine Manually",
    or: "Or",
    noMedicinesAdded: "No Medicines Added Yet",
    addMedicine: "Add Medicine",
    selectLanguage: "Select Language",
    save: "Save",
    personalInfo: "Personal Information",
    name: "Name",
    phone: "Phone",
    language: "Language",
    medicine: "Medicine",
    schedule: "Schedule",
    ailment: "Ailment",
    perServing: "Per Serving",
    timesADay: "Times A Day",
    days: "Days",
    next: "Next",
    back: "Back",
    confirm: "Confirm",
    whatAreYouTakingThisFor: "What Are You Taking This For?",
    weWontShareThis: "We Won't Share This With Anyone",
    currentLanguage: "English",
  },
  hindi: {
    hello: "नमस्ते",
    tellUsYourMedicine: "हमें अपनी दवा बताएं",
    addYourMedicineManually: "अपनी दवा मैन्युअली जोड़ें",
    or: "या",
    noMedicinesAdded: "अभी तक कोई दवा नहीं जोड़ी गई",
    addMedicine: "दवा जोड़ें",
    selectLanguage: "भाषा चुनें",
    save: "सहेजें",
    personalInfo: "व्यक्तिगत जानकारी",
    name: "नाम",
    phone: "फ़ोन",
    language: "भाषा",
    medicine: "दवा",
    schedule: "समय",
    ailment: "बीमारी",
    perServing: "प्रति खुराक",
    timesADay: "दिन में कितनी बार",
    days: "दिन",
    next: "आगे",
    back: "पीछे",
    confirm: "पुष्टि करें",
    whatAreYouTakingThisFor: "आप यह किसके लिए ले रहे हैं?",
    weWontShareThis: "हम इसे किसी के साथ साझा नहीं करेंगे",
    currentLanguage: "हिन्दी",
  },
  bengali: {
    hello: "হ্যালো",
    tellUsYourMedicine: "আপনার ওষুধ সম্পর্কে বলুন",
    addYourMedicineManually: "ম্যানুয়ালি ওষুধ যোগ করুন",
    or: "অথবা",
    noMedicinesAdded: "এখনও কোনো ওষুধ যোগ করা হয়নি",
    addMedicine: "ওষুধ যোগ করুন",
    selectLanguage: "ভাষা নির্বাচন করুন",
    save: "সংরক্ষণ করুন",
    personalInfo: "ব্যক্তিগত তথ্য",
    name: "নাম",
    phone: "ফোন",
    language: "ভাষা",
    medicine: "ওষুধ",
    schedule: "সময়সূচী",
    ailment: "রোগ",
    perServing: "প্রতি সেবায়",
    timesADay: "দিনে কতবার",
    days: "দিন",
    next: "পরবর্তী",
    back: "পিছনে",
    confirm: "নিশ্চিত করুন",
    whatAreYouTakingThisFor: "এটা কিসের জন্য খাচ্ছেন?",
    weWontShareThis: "আমরা এটি কারো সাথে শেয়ার করব না",
    currentLanguage: "বাংলা",
  },
  gujarati: {
    hello: "નમસ્તે",
    tellUsYourMedicine: "અમને તમારી દવા વિશે જણાવો",
    addYourMedicineManually: "મેન્યુઅલી દવા ઉમેરો",
    or: "અથવા",
    noMedicinesAdded: "હજુ સુધી કોઈ દવા ઉમેરવામાં આવી નથી",
    addMedicine: "દવા ઉમેરો",
    selectLanguage: "ભાષા પસંદ કરો",
    save: "સાચવો",
    personalInfo: "વ્યક્તિગત માહિતી",
    name: "નામ",
    phone: "ફોન",
    language: "ભાષા",
    medicine: "દવા",
    schedule: "સમયપત્રક",
    ailment: "બીમારી",
    perServing: "દરેક સર્વિંગ દીઠ",
    timesADay: "દિવસમાં કેટલી વાર",
    days: "દિવસો",
    next: "આગળ",
    back: "પાછળ",
    confirm: "પુષ્ટિ કરો",
    whatAreYouTakingThisFor: "આ શેના માટે લઈ રહ્યા છો?",
    weWontShareThis: "અમે આ કોઈની સાથે શેર નહીં કરીએ",
    currentLanguage: "ગુજરાતી",
  },
  tamil: {
    hello: "வணக்கம்",
    tellUsYourMedicine: "உங்கள் மருந்தைப் பற்றி சொல்லுங்கள்",
    addYourMedicineManually: "கைமுறையாக மருந்தைச் சேர்க்கவும்",
    or: "அல்லது",
    noMedicinesAdded: "இன்னும் மருந்துகள் சேர்க்கப்படவில்லை",
    addMedicine: "மருந்து சேர்க்க",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    save: "சேமிக்க",
    personalInfo: "தனிப்பட்ட தகவல்",
    name: "பெயர்",
    phone: "தொலைபேசி",
    language: "மொழி",
    medicine: "மருந்து",
    schedule: "அட்டவணை",
    ailment: "நோய்",
    perServing: "ஒரு தடவைக்கு",
    timesADay: "தினம் எத்தனை முறை",
    days: "நாட்கள்",
    next: "அடுத்து",
    back: "பின்னால்",
    confirm: "உறுதிப்படுத்து",
    whatAreYouTakingThisFor: "இது எதற்காக எடுக்கிறீர்கள்?",
    weWontShareThis: "இதை யாருடனும் பகிர மாட்டோம்",
    currentLanguage: "தமிழ்",
  },
  telugu: {
    hello: "హలో",
    tellUsYourMedicine: "మీ మందు గురించి చెప్పండి",
    addYourMedicineManually: "మాన్యువల్‌గా మందు జోడించండి",
    or: "లేదా",
    noMedicinesAdded: "ఇంకా మందులు జోడించబడలేదు",
    addMedicine: "మందు జోడించండి",
    selectLanguage: "భాష ఎంచుకోండి",
    save: "సేవ్ చేయండి",
    personalInfo: "వ్యక్తిగత సమాచారం",
    name: "పేరు",
    phone: "ఫోన్",
    language: "భాష",
    medicine: "మందు",
    schedule: "షెడ్యూల్",
    ailment: "వ్యాధి",
    perServing: "ఒక సారి",
    timesADay: "రోజుకు ఎన్ని సార్లు",
    days: "రోజులు",
    next: "తదుపరి",
    back: "వెనుకకు",
    confirm: "నిర్ధారించండి",
    whatAreYouTakingThisFor: "ఇది దేని కోసం తీసుకుంటున్నారు?",
    weWontShareThis: "మేము దీన్ని ఎవరితోనూ షేర్ చేయము",
    currentLanguage: "తెలుగు",
  },
};

type TranslationContextType = {
  t: (key: TranslationKey) => string;
  language: string;
  setLanguage: (lang: string) => void;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState("english");

  useEffect(() => {
    const saved = localStorage.getItem("medbox_language");
    if (saved) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("medbox_language", lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.english[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
};
