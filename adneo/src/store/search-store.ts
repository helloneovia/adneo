import { create } from "zustand";
import type {
  DomainResult,
  SearchFilters,
  SearchProgress,
  SortOption,
  DEFAULT_FILTERS,
} from "@/types/domain";
import { EXTENSION_PACKS } from "@/types/domain";

interface SearchState {
  // Search inputs
  query: string;
  mode: "smart" | "exact" | "batch";
  selectedExtensions: string[];

  // Filters
  filters: SearchFilters;

  // Search state
  isSearching: boolean;
  progress: SearchProgress | null;
  progressLog: string[];

  // Results
  results: DomainResult[];
  sortBy: SortOption;

  // Actions
  setQuery: (query: string) => void;
  setMode: (mode: "smart" | "exact" | "batch") => void;
  setSelectedExtensions: (extensions: string[]) => void;
  toggleExtensionPack: (packName: string) => void;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  resetFilters: () => void;
  setIsSearching: (isSearching: boolean) => void;
  setProgress: (progress: SearchProgress | null) => void;
  addProgressLog: (log: string) => void;
  clearProgressLog: () => void;
  setResults: (results: DomainResult[]) => void;
  addResult: (result: DomainResult) => void;
  updateResultStatus: (domain: string, status: DomainResult["status"]) => void;
  setSortBy: (sortBy: SortOption) => void;
  clearResults: () => void;
}

const defaultFilters: SearchFilters = {
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

export const useSearchStore = create<SearchState>((set, get) => ({
  // Initial state
  query: "",
  mode: "smart",
  selectedExtensions: [...EXTENSION_PACKS.top, ...EXTENSION_PACKS.tech.slice(0, 3)],
  filters: { ...defaultFilters },
  isSearching: false,
  progress: null,
  progressLog: [],
  results: [],
  sortBy: "bestMatch",

  // Actions
  setQuery: (query) => set({ query }),

  setMode: (mode) => set({ mode }),

  setSelectedExtensions: (extensions) => set({ selectedExtensions: extensions }),

  toggleExtensionPack: (packName) => {
    const pack = EXTENSION_PACKS[packName as keyof typeof EXTENSION_PACKS];
    if (!pack) return;

    const { selectedExtensions } = get();
    const allSelected = pack.every((ext) => selectedExtensions.includes(ext));

    if (allSelected) {
      // Remove all from pack
      set({
        selectedExtensions: selectedExtensions.filter((ext) => !pack.includes(ext)),
      });
    } else {
      // Add all from pack
      const newExtensions = [...new Set([...selectedExtensions, ...pack])];
      set({ selectedExtensions: newExtensions });
    }
  },

  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  setIsSearching: (isSearching) => set({ isSearching }),

  setProgress: (progress) => set({ progress }),

  addProgressLog: (log) =>
    set((state) => ({
      progressLog: [...state.progressLog, log],
    })),

  clearProgressLog: () => set({ progressLog: [] }),

  setResults: (results) => set({ results }),

  addResult: (result) =>
    set((state) => ({
      results: [...state.results, result],
    })),

  updateResultStatus: (domain, status) =>
    set((state) => ({
      results: state.results.map((r) =>
        r.domain === domain ? { ...r, status, checkedAt: Date.now() } : r
      ),
    })),

  setSortBy: (sortBy) => set({ sortBy }),

  clearResults: () => set({ results: [], progressLog: [] }),
}));
