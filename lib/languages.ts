export type Language = "fr" | "en" | "es" | "zh" | "de" | "it" | "pt" | "nl" | "ja" | "ko" | "ar" | "hi" | "ru" | "tr";

export const SUPPORTED_LANGUAGES: Language[] = [
  "fr",
  "en",
  "es",
  "zh",
  "de",
  "it",
  "pt",
  "nl",
  "ja",
  "ko",
  "ar",
  "hi",
  "ru",
  "tr",
];

export const LANGUAGE_OPTIONS: { code: Language; name: string; flag: string }[] = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
];

export function isSupportedLanguage(value: string): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

export function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language || navigator.languages?.[0] || "en";
  const langCode = browserLang.split("-")[0].toLowerCase();

  return isSupportedLanguage(langCode) ? langCode : "en";
}
