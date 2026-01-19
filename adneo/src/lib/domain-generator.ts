import type { SearchFilters } from "@/types/domain";

// Premium prefixes for brandable names
const PREMIUM_PREFIXES = [
  "get",
  "try",
  "go",
  "use",
  "my",
  "join",
  "app",
  "the",
  "hey",
  "hi",
  "on",
  "with",
  "be",
  "do",
  "we",
  "pro",
  "easy",
  "smart",
  "super",
  "ultra",
  "mega",
  "hyper",
  "meta",
  "neo",
  "zen",
  "all",
  "one",
];

// Premium suffixes for tech/startup names
const PREMIUM_SUFFIXES = [
  "hub",
  "labs",
  "studio",
  "cloud",
  "ai",
  "io",
  "pay",
  "stack",
  "base",
  "flow",
  "link",
  "app",
  "box",
  "kit",
  "fy",
  "ly",
  "hq",
  "pro",
  "plus",
  "now",
  "go",
  "up",
  "x",
  "co",
  "team",
  "space",
  "zone",
  "point",
  "spot",
  "nest",
  "ware",
  "soft",
  "tech",
  "works",
  "ops",
  "core",
  "mind",
  "wave",
  "sync",
  "dash",
  "port",
  "gate",
  "grid",
  "mesh",
  "node",
  "net",
  "bit",
  "byte",
];

// Vowels and consonants for brandable variations
const VOWELS = ["a", "e", "i", "o", "u"];
const CONSONANTS = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "r",
  "s",
  "t",
  "v",
  "w",
  "z",
];

// Business synonyms for common words
const SYNONYMS: Record<string, string[]> = {
  fast: ["quick", "rapid", "swift", "speedy", "instant"],
  secure: ["safe", "guard", "shield", "protect", "vault"],
  smart: ["clever", "wise", "bright", "genius", "intel"],
  simple: ["easy", "clear", "clean", "pure", "lite"],
  connect: ["link", "join", "unite", "sync", "bridge"],
  create: ["make", "build", "craft", "forge", "form"],
  money: ["cash", "fund", "pay", "coin", "wealth"],
  health: ["fit", "well", "vita", "care", "heal"],
  learn: ["edu", "study", "skill", "know", "teach"],
  data: ["info", "stat", "meta", "byte", "log"],
  team: ["crew", "squad", "group", "clan", "tribe"],
  work: ["job", "task", "gig", "opus", "craft"],
  home: ["nest", "casa", "base", "pad", "den"],
  shop: ["store", "mart", "buy", "cart", "deal"],
  cloud: ["sky", "air", "mist", "fog", "vapor"],
  trade: ["swap", "deal", "flip", "bid", "sell"],
  code: ["dev", "hack", "prog", "script", "algo"],
  market: ["mart", "plaza", "hub", "trade", "bazaar"],
  finance: ["fin", "fund", "capital", "invest", "wealth"],
  crypto: ["chain", "block", "token", "coin", "defi"],
  ai: ["neural", "brain", "mind", "cogni", "synth"],
};

function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function splitIntoWords(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s,]+/)
    .map((w) => normalizeWord(w))
    .filter((w) => w.length > 0);
}

function generateConcatenations(words: string[]): string[] {
  const results: string[] = [];

  // Direct concatenation
  if (words.length > 1) {
    results.push(words.join(""));

    // All pairs
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < words.length; j++) {
        if (i !== j) {
          results.push(words[i] + words[j]);
        }
      }
    }
  }

  return results;
}

function generatePrefixVariants(words: string[]): string[] {
  const results: string[] = [];

  for (const word of words) {
    for (const prefix of PREMIUM_PREFIXES) {
      results.push(prefix + word);
    }
  }

  // Also try with concatenated words
  if (words.length > 1) {
    const concat = words.join("");
    for (const prefix of PREMIUM_PREFIXES.slice(0, 10)) {
      results.push(prefix + concat);
    }
  }

  return results;
}

function generateSuffixVariants(words: string[]): string[] {
  const results: string[] = [];

  for (const word of words) {
    for (const suffix of PREMIUM_SUFFIXES) {
      results.push(word + suffix);
    }
  }

  // Also try with concatenated words
  if (words.length > 1) {
    const concat = words.join("");
    for (const suffix of PREMIUM_SUFFIXES.slice(0, 15)) {
      results.push(concat + suffix);
    }
  }

  return results;
}

function generateBrandableVariants(word: string): string[] {
  const results: string[] = [];

  // Double last consonant + y
  if (word.length >= 3 && !VOWELS.includes(word[word.length - 1])) {
    results.push(word + word[word.length - 1] + "y");
  }

  // Remove vowels (if still pronounceable)
  const noVowels = word.replace(/[aeiou]/g, "");
  if (noVowels.length >= 3 && noVowels.length <= 6) {
    results.push(noVowels);
  }

  // Add 'r' or 'er' suffix
  if (!word.endsWith("r") && !word.endsWith("er")) {
    results.push(word + "r");
    results.push(word + "er");
  }

  // Add 'o' suffix (like Zappo)
  if (!VOWELS.includes(word[word.length - 1])) {
    results.push(word + "o");
  }

  // Swap last vowel
  for (let i = word.length - 1; i >= 0; i--) {
    if (VOWELS.includes(word[i])) {
      for (const v of VOWELS) {
        if (v !== word[i]) {
          results.push(word.substring(0, i) + v + word.substring(i + 1));
        }
      }
      break;
    }
  }

  // Add 'i' or 'ify' suffix
  if (!word.endsWith("i") && !word.endsWith("ify")) {
    results.push(word + "i");
    results.push(word + "ify");
  }

  return results;
}

function generateSynonymVariants(words: string[]): string[] {
  const results: string[] = [];

  for (const word of words) {
    const synonymList = SYNONYMS[word];
    if (synonymList) {
      results.push(...synonymList);

      // Combine synonyms with other words
      for (const otherWord of words) {
        if (otherWord !== word) {
          for (const synonym of synonymList.slice(0, 3)) {
            results.push(synonym + otherWord);
            results.push(otherWord + synonym);
          }
        }
      }
    }
  }

  return results;
}

function generateAbbreviations(words: string[]): string[] {
  const results: string[] = [];

  if (words.length > 1) {
    // First letters
    const initials = words.map((w) => w[0]).join("");
    if (initials.length >= 2) {
      results.push(initials);

      // Initials + suffixes
      for (const suffix of ["hub", "ai", "io", "app", "pro"]) {
        results.push(initials + suffix);
      }
    }

    // First 2-3 letters of each
    const shortForms = words.map((w) => w.substring(0, Math.min(3, w.length)));
    results.push(shortForms.join(""));
  }

  for (const word of words) {
    if (word.length > 5) {
      // First 3-4 letters
      results.push(word.substring(0, 3));
      results.push(word.substring(0, 4));

      // First + last letters
      results.push(word[0] + word.substring(word.length - 2));
    }
  }

  return results;
}

export function generateDomainNames(
  query: string,
  mode: "smart" | "exact" | "batch",
  filters: SearchFilters,
  maxCandidates: number = 500
): string[] {
  const words = splitIntoWords(query);

  if (words.length === 0) {
    return [];
  }

  let candidates: Set<string> = new Set();

  if (mode === "exact") {
    // Only use the exact words
    candidates.add(words.join(""));
    for (const word of words) {
      candidates.add(word);
    }
  } else if (mode === "batch") {
    // Each line is a separate domain name
    const lines = query.split("\n").filter((l) => l.trim());
    for (const line of lines) {
      candidates.add(normalizeWord(line));
    }
  } else {
    // Smart mode - generate many variations
    // Add original words
    for (const word of words) {
      candidates.add(word);
    }

    // Concatenations
    for (const name of generateConcatenations(words)) {
      candidates.add(name);
    }

    // Prefix variants
    for (const name of generatePrefixVariants(words)) {
      candidates.add(name);
    }

    // Suffix variants
    for (const name of generateSuffixVariants(words)) {
      candidates.add(name);
    }

    // Brandable variants
    for (const word of words) {
      for (const name of generateBrandableVariants(word)) {
        candidates.add(name);
      }
    }

    // Synonym variants
    for (const name of generateSynonymVariants(words)) {
      candidates.add(name);
    }

    // Abbreviations
    for (const name of generateAbbreviations(words)) {
      candidates.add(name);
    }

    // Mixed prefix + suffix
    for (const word of words) {
      for (const prefix of PREMIUM_PREFIXES.slice(0, 5)) {
        for (const suffix of PREMIUM_SUFFIXES.slice(0, 5)) {
          candidates.add(prefix + word + suffix);
        }
      }
    }
  }

  // Filter and normalize
  let filtered = Array.from(candidates)
    .map((name) => normalizeWord(name))
    .filter((name) => {
      // Basic validation
      if (name.length < 2 || name.length > 63) return false;

      // Length filters
      if (name.length < filters.minLength || name.length > filters.maxLength) {
        return false;
      }

      // No hyphens filter
      if (!filters.allowHyphens && name.includes("-")) {
        return false;
      }

      // No digits filter
      if (!filters.allowDigits && /\d/.test(name)) {
        return false;
      }

      // Starts with filter
      if (filters.startsWith && !name.startsWith(filters.startsWith.toLowerCase())) {
        return false;
      }

      // Ends with filter
      if (filters.endsWith && !name.endsWith(filters.endsWith.toLowerCase())) {
        return false;
      }

      // Contains keyword filter
      if (filters.containsKeyword && !name.includes(filters.containsKeyword.toLowerCase())) {
        return false;
      }

      // Exclude words filter
      for (const excluded of filters.excludeWords) {
        if (name.includes(excluded.toLowerCase())) {
          return false;
        }
      }

      // Exclude awkward letters
      if (filters.excludeAwkwardLetters && /[qxz]/i.test(name)) {
        return false;
      }

      // No double letters
      if (filters.noDoubleLetters && /(.)\1/.test(name)) {
        return false;
      }

      // No triple consonants
      if (filters.noTripleConsonants && /[bcdfghjklmnpqrstvwxyz]{3}/i.test(name)) {
        return false;
      }

      // No repetitions
      if (filters.noRepetitions && /(.)\1\1/.test(name)) {
        return false;
      }

      return true;
    });

  // Remove duplicates and limit
  filtered = [...new Set(filtered)];

  // Limit candidates
  if (filtered.length > maxCandidates) {
    filtered = filtered.slice(0, maxCandidates);
  }

  return filtered;
}

export function isPronounceableName(name: string): boolean {
  const lower = name.toLowerCase();

  // Must have at least one vowel
  if (!/[aeiou]/.test(lower)) {
    return false;
  }

  // Check for too many consecutive consonants (>3)
  if (/[bcdfghjklmnpqrstvwxyz]{4,}/.test(lower)) {
    return false;
  }

  // Check for too many consecutive vowels (>2)
  if (/[aeiou]{3,}/.test(lower)) {
    return false;
  }

  // Common unpronounceable patterns
  const badPatterns = [
    /^[bcdfghjklmnpqrstvwxyz]{3}/, // Starts with 3 consonants
    /[bcdfghjklmnpqrstvwxyz]{3}$/, // Ends with 3 consonants
    /qx|xq|zx|xz|qq|xx|zz/, // Bad letter combos
    /^ng|^sr|^tn|^bn|^gn|^pn|^mn/, // Hard to pronounce starts
  ];

  for (const pattern of badPatterns) {
    if (pattern.test(lower)) {
      return false;
    }
  }

  return true;
}
