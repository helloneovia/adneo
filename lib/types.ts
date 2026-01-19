import { DomainCandidate } from "./domain-generator";
import { ScoredDomain } from "./domain-scorer";
import { AvailabilityResult } from "./availability-checker";

export interface SearchRequest {
  keywords: string[];
  tlds: string[];
  mode: "smart" | "exact" | "batch";
  options: {
    allowHyphens?: boolean;
    allowDigits?: boolean;
    maxLength?: number;
    minLength?: number;
    excludeWords?: string[];
    minBrandScore?: number;
    minMemorableScore?: number;
    category?: string;
    style?: string;
    tone?: string;
  };
}

export interface SearchProgress {
  stage: "generating" | "normalizing" | "checking" | "scoring" | "filtering" | "done";
  progress: number; // 0-100
  message: string;
  details?: {
    generated?: number;
    unique?: number;
    checking?: { current: number; total: number; tlds: number };
    scored?: number;
    available?: number;
  };
}

export interface SearchResult {
  domains: ScoredDomain[];
  available: AvailabilityResult[];
  finalResults: FinalDomainResult[];
}

export interface FinalDomainResult extends ScoredDomain {
  availability: AvailabilityResult;
}

export type SortOption = "best-match" | "shortest" | "highest-score" | "most-premium" | "keyword-strongest";
