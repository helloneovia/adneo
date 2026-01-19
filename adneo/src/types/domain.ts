export type DomainStatus = "available" | "taken" | "unknown" | "checking";

export interface DomainResult {
  id: string;
  domain: string;
  name: string;
  tld: string;
  status: DomainStatus;
  score: number;
  scores: {
    brandability: number;
    pronounceability: number;
    seoKeywordFit: number;
    lengthScore: number;
    cleanCharacters: number;
    businessIntent: number;
  };
  tags: string[];
  checkedAt?: number;
  buyUrl: string;
}

export interface SearchFilters {
  // Format filters
  minLength: number;
  maxLength: number;
  wordCount: number[];
  allowHyphens: boolean;
  allowDigits: boolean;
  startsWith: string;
  endsWith: string;
  containsKeyword: string;
  excludeWords: string[];

  // Branding filters
  pronounceable: boolean;
  style: string[];
  minBrandableScore: number;
  minMemorableScore: number;
  excludeAwkwardLetters: boolean;

  // SEO filters
  keywordExactMatch: boolean;
  keywordPosition: "any" | "start" | "middle" | "end";
  minSeoScore: number;

  // Business intent
  categories: string[];
  tone: string[];

  // Quality filters
  noDoubleLetters: boolean;
  noTripleConsonants: boolean;
  noRepetitions: boolean;
  minGlobalScore: number;
}

export interface SearchOptions {
  query: string;
  mode: "smart" | "exact" | "batch";
  extensions: string[];
  filters: SearchFilters;
}

export interface SearchProgress {
  step: string;
  message: string;
  percentage: number;
  details?: string;
}

export type SortOption = "bestMatch" | "shortest" | "brandScore" | "premium" | "keyword";

export const EXTENSION_PACKS: Record<string, string[]> = {
  top: [".com", ".net", ".org", ".co"],
  tech: [".io", ".ai", ".app", ".dev", ".xyz", ".tech", ".cloud", ".site", ".online"],
  business: [".store", ".shop", ".biz", ".company", ".inc", ".agency", ".solutions", ".services"],
  creative: [".studio", ".design", ".media", ".live"],
  security: [".security", ".network", ".systems"],
  web3: [".crypto", ".nft", ".dao", ".defi"],
  local: [".fr", ".de", ".uk", ".es", ".it", ".eu", ".ca", ".us", ".ch", ".be"],
};

export const ALL_EXTENSIONS = [
  ...EXTENSION_PACKS.top,
  ...EXTENSION_PACKS.tech,
  ...EXTENSION_PACKS.business,
  ...EXTENSION_PACKS.creative,
  ...EXTENSION_PACKS.security,
  ...EXTENSION_PACKS.web3,
  ...EXTENSION_PACKS.local,
].filter((v, i, a) => a.indexOf(v) === i);

export const STYLE_OPTIONS = [
  "Startup",
  "Corporate",
  "Fun",
  "Luxury",
  "Minimal",
  "Tech",
  "Creative",
];

export const CATEGORY_OPTIONS = [
  "SaaS",
  "Finance",
  "Health",
  "Ecommerce",
  "Crypto",
  "DevTools",
  "Marketing",
  "Real Estate",
  "Education",
  "AI/ML",
];

export const TONE_OPTIONS = ["Serious", "Premium", "Casual", "Playful", "Professional"];

export const DEFAULT_FILTERS: SearchFilters = {
  minLength: 3,
  maxLength: 15,
  wordCount: [1, 2],
  allowHyphens: false,
  allowDigits: false,
  startsWith: "",
  endsWith: "",
  containsKeyword: "",
  excludeWords: [],
  pronounceable: true,
  style: [],
  minBrandableScore: 0,
  minMemorableScore: 0,
  excludeAwkwardLetters: false,
  keywordExactMatch: false,
  keywordPosition: "any",
  minSeoScore: 0,
  categories: [],
  tone: [],
  noDoubleLetters: false,
  noTripleConsonants: false,
  noRepetitions: false,
  minGlobalScore: 0,
};
