export type SearchMode = "smart" | "exact" | "batch";

export type KeywordPosition = "any" | "start" | "middle" | "end";
export type BrandStyle = "any" | "startup" | "corporate" | "fun" | "luxury" | "minimal";
export type BusinessCategory =
  | "any"
  | "saas"
  | "finance"
  | "health"
  | "ecom"
  | "crypto"
  | "devtools"
  | "marketing"
  | "realestate"
  | "education";
export type Tone = "any" | "serious" | "premium" | "casual";

export interface SearchFilters {
  lengthMin: number;
  lengthMax: number;
  wordCount: number[];
  allowHyphen: boolean;
  allowDigits: boolean;
  startsWith: string;
  endsWith: string;
  keywordExact: boolean;
  excludeWords: string[];
  pronouncable: boolean;
  style: BrandStyle;
  brandMin: number;
  memorableMin: number;
  avoidLetters: string[];
  seoMin: number;
  keywordPosition: KeywordPosition;
  category: BusinessCategory;
  tone: Tone;
  noDoubleLetters: boolean;
  noTripleConsonants: boolean;
  noRepeats: boolean;
  globalMin: number;
  maxBudget: number;
  regOnly: boolean;
}

export interface DomainScores {
  brandability: number;
  pronounceability: number;
  seo: number;
  length: number;
  clean: number;
  intent: number;
  memorable: number;
}

export interface DomainResult {
  domain: string;
  label: string;
  tld: string;
  status: "available";
  score: number;
  scores: DomainScores;
  tags: string[];
  priceEstimate?: number;
  buyUrl: string;
  checkedAt: string;
  provider: string;
}

export interface SearchProgress {
  stage: "generate" | "normalize" | "check" | "score" | "done";
  percent: number;
  message: string;
  detail?: string;
  created?: number;
  checked?: number;
  total?: number;
  available?: number;
}

export type SearchEvent =
  | { type: "progress"; payload: SearchProgress }
  | { type: "result"; payload: DomainResult }
  | { type: "done"; payload: { available: number; durationMs: number } }
  | { type: "error"; payload: { message: string } };
