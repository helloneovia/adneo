"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/lib/i18n";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  const languages = [
    { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
    { code: "en" as Language, name: "English", flag: "🇬🇧" },
    { code: "es" as Language, name: "Español", flag: "🇪🇸" },
    { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
    { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
    { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
    { code: "pt" as Language, name: "Português", flag: "🇵🇹" },
    { code: "nl" as Language, name: "Nederlands", flag: "🇳🇱" },
    { code: "ja" as Language, name: "日本語", flag: "🇯🇵" },
    { code: "ko" as Language, name: "한국어", flag: "🇰🇷" },
    { code: "ar" as Language, name: "العربية", flag: "🇸🇦" },
    { code: "hi" as Language, name: "हिन्दी", flag: "🇮🇳" },
    { code: "ru" as Language, name: "Русский", flag: "🇷🇺" },
    { code: "tr" as Language, name: "Türkçe", flag: "🇹🇷" },
  ];

  return (
    <Select value={currentLang} onValueChange={(v) => onLanguageChange(v as Language)}>
      <SelectTrigger className="w-[140px] glass border-0">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
