"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "bn";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        "nav.home": "Home",
        "nav.explore": "Explore Missions",
        "nav.about": "About",
        "nav.contact": "Contact",
        "nav.dashboard": "Dashboard",
        "nav.profile": "Profile",
        "nav.login": "Log In",
        "nav.post_mission": "+ Post Mission",
        "hero.badge": "CRISIS RESPONSE NETWORK",
        "hero.title": "Rapid Disaster Relief & Volunteer Coordination",
        "hero.subtitle": "Connecting frontline emergency teams, verified organizations, and volunteer responders during critical crises across Bangladesh.",
        "hero.explore": "Explore Active Missions",
        "hero.post": "Report a Crisis",
        "missions.title": "Active Response Missions",
        "missions.view_map": "Map View",
        "missions.view_grid": "Grid View",
        "missions.viewers": "people viewing this mission",
        "missions.volunteers_joined": "volunteers joined",
        "missions.target": "Target",
        "missions.urgency": "Urgency",
        "missions.disaster_type": "Disaster Type",
        "missions.location": "Location",
        "missions.est_hours": "Estimated Hours",
        "missions.join_button": "Join Mission",
        "missions.joined_button": "✓ You've Joined",
        "missions.verified": "Verified Organization",
        "profile.impact_title": "Your Volunteer Impact",
        "profile.hours_contributed": "Hours Contributed",
        "profile.missions_joined": "Missions Joined",
        "profile.badges_title": "Achievement Badges",
        "upload.drag_drop": "Drag & drop mission photo here, or click to browse",
        "upload.uploading": "Uploading image...",
        "upload.change": "Change Image",
    },
    bn: {
        "nav.home": "হোম",
        "nav.explore": "মিশন খুঁজুন",
        "nav.about": "আমাদের সম্পর্কে",
        "nav.contact": "যোগাযোগ",
        "nav.dashboard": "ড্যাশবোর্ড",
        "nav.profile": "প্রোফাইল",
        "nav.login": "লগইন",
        "nav.post_mission": "+ মিশন পোস্ট করুন",
        "hero.badge": "জরুরি দুর্যোগ মোকাবিলা নেটওয়ার্ক",
        "hero.title": "দ্রুত দুর্যোগ সহায়তা ও স্বেচ্ছাসেবী সমন্বয়",
        "hero.subtitle": "বাংলাদেশজুড়ে জরুরি দুর্যোগকালীন সময়ে উদ্ধারকারী দল, যাচাইকৃত সংস্থা এবং স্বেচ্ছাসেবীদের একত্রিত করার প্ল্যাটফর্ম।",
        "hero.explore": "সক্রিয় মিশনসমূহ দেখুন",
        "hero.post": "সংকট রিপোর্ট করুন",
        "missions.title": "সক্রিয় রেসপন্স মিশনসমূহ",
        "missions.view_map": "ম্যাপ ভিউ",
        "missions.view_grid": "গ্রিড ভিউ",
        "missions.viewers": "জন এই মিশনটি দেখছেন",
        "missions.volunteers_joined": "জন স্বেচ্ছাসেবক যুক্ত হয়েছেন",
        "missions.target": "লক্ষ্যমাত্রা",
        "missions.urgency": "জরুরি মাত্রা",
        "missions.disaster_type": "দুর্যোগের ধরন",
        "missions.location": "স্থান",
        "missions.est_hours": "আনুমানিক সময়",
        "missions.join_button": "মিশনে যোগ দিন",
        "missions.joined_button": "✓ আপনি যুক্ত হয়েছেন",
        "missions.verified": "যাচাইকৃত সংস্থা",
        "profile.impact_title": "আপনার সেবামূলক অবদান",
        "profile.hours_contributed": "ঘণ্টা সেবাদান",
        "profile.missions_joined": "মিশনে অংশগ্রহণ",
        "profile.badges_title": "অর্জিত ব্যাজসমূহ",
        "upload.drag_drop": "ছবি ড্রাগ করে ছেড়ে দিন বা ক্লিক করে ফাইল বাছুন",
        "upload.uploading": "ছবি আপলোড হচ্ছে...",
        "upload.change": "ছবি পরিবর্তন করুন",
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
        const saved = localStorage.getItem("rescuelink_lang") as Language;
        if (saved && (saved === "en" || saved === "bn")) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("rescuelink_lang", lang);
    };

    const t = (key: string): string => {
        return translations[language]?.[key] || translations["en"]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
