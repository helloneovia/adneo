import { SearchFilters, SearchMode, DomainResult, DomainScores } from "@/lib/types";

const PREFIXES = ["get", "try", "go", "use", "my", "join", "app", "the"];
const SUFFIXES = [
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
];

const STYLE_TAGS: Record<string, string[]> = {
  startup: ["ai", "labs", "stack", "flow", "cloud"],
  corporate: ["group", "capital", "ventures", "systems"],
  fun: ["spark", "joy", "boost"],
  luxury: ["luxe", "elite", "prime"],
  minimal: ["neo", "clear", "zen"],
};

const TONE_TAGS: Record<string, string[]> = {
  serious: ["capital", "systems", "secure", "core"],
  premium: ["prime", "luxe", "elite", "select"],
  casual: ["easy", "simple", "happy", "loop"],
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  saas: ["cloud", "stack", "suite", "flow", "desk"],
  finance: ["pay", "money", "vault", "ledger", "capital"],
  health: ["health", "care", "fit", "well", "vita"],
  ecom: ["shop", "store", "cart", "mart", "supply"],
  crypto: ["crypto", "chain", "block", "token", "wallet"],
  devtools: ["dev", "code", "stack", "labs", "ops"],
  marketing: ["ad", "growth", "brand", "spark", "reach"],
  realestate: ["home", "estate", "realty", "property", "rent"],
  education: ["learn", "academy", "study", "skill", "teach"],
};

const BUSINESS_WORDS = ["studio", "labs", "works", "systems", "group", "partners"];

const vowels = new Set(["a", "e", "i", "o", "u", "y"]);
const consonantCluster = /[bcdfghjklmnpqrstvwxyz]{3,}/;

interface Candidate {
  label: string;
  words: string[];
}

const cleanWord = (word: string) =>
  word
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");

export const defaultFilters: SearchFilters = {
  lengthMin: 4,
  lengthMax: 14,
  wordCount: [1, 2],
  allowHyphen: false,
  allowDigits: false,
  startsWith: "",
  endsWith: "",
  keywordExact: false,
  excludeWords: [],
  pronouncable: true,
  style: "any",
  brandMin: 12,
  memorableMin: 10,
  avoidLetters: [],
  seoMin: 6,
  keywordPosition: "any",
  category: "any",
  tone: "any",
  noDoubleLetters: false,
  noTripleConsonants: true,
  noRepeats: true,
  globalMin: 50,
  maxBudget: 400,
  regOnly: false,
};

export function parseInput(raw: string, mode: SearchMode) {
  if (mode === "batch") {
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [raw.trim()].filter(Boolean);
}

export function generateCandidates(raw: string, mode: SearchMode) {
  const inputs = parseInput(raw, mode);
  const candidates: Candidate[] = [];

  inputs.forEach((input) => {
    const words = input
      .split(/\s+/)
      .map(cleanWord)
      .filter(Boolean);

    if (mode === "exact") {
      candidates.push({ label: cleanWord(words.join("")), words });
      return;
    }

    if (words.length === 1) {
      const base = words[0];
      candidates.push({ label: base, words: [base] });
      PREFIXES.forEach((prefix) =>
        candidates.push({ label: `${prefix}${base}`, words: [prefix, base] })
      );
      SUFFIXES.forEach((suffix) =>
        candidates.push({ label: `${base}${suffix}`, words: [base, suffix] })
      );
      BUSINESS_WORDS.forEach((suffix) =>
        candidates.push({ label: `${base}${suffix}`, words: [base, suffix] })
      );
      candidates.push({ label: `${base}-ai`, words: [base, "ai"] });
    } else {
      const joined = words.join("");
      candidates.push({ label: joined, words });
      candidates.push({ label: words.join("-"), words });
      candidates.push({ label: `${words[0]}${words[1]}`, words });
      candidates.push({ label: `${words[0]}${words[1]}ai`, words: [...words, "ai"] });
      candidates.push({ label: `${words[0]}${words[1]}hub`, words: [...words, "hub"] });
      PREFIXES.forEach((prefix) =>
        candidates.push({ label: `${prefix}${joined}`, words: [prefix, ...words] })
      );
    }

    const style = STYLE_TAGS.startup;
    style.forEach((tag) =>
      candidates.push({ label: `${words[0]}${tag}`, words: [words[0], tag] })
    );
  });

  return candidates
    .map((candidate) => ({
      ...candidate,
      label: cleanWord(candidate.label),
    }))
    .filter((candidate) => candidate.label.length > 0);
}

export function dedupeCandidates(candidates: Candidate[], limit: number) {
  const seen = new Set<string>();
  const unique: Candidate[] = [];

  for (const candidate of candidates) {
    if (seen.has(candidate.label)) continue;
    seen.add(candidate.label);
    unique.push(candidate);
    if (unique.length >= limit) break;
  }

  return unique;
}

export function isPronounceable(label: string) {
  const hasVowel = label.split("").some((char) => vowels.has(char));
  if (!hasVowel) return false;
  if (consonantCluster.test(label)) return false;
  return true;
}

export function scoreCandidate(label: string, keywords: string[], filters: SearchFilters) {
  const lengthScore = Math.max(0, 15 - Math.abs(label.length - 8));
  const cleanScore = label.match(/[^a-z]/) ? 6 : 10;
  const vowelCount = label.split("").filter((char) => vowels.has(char)).length;
  const pronounceability = Math.min(20, vowelCount * 3 + (isPronounceable(label) ? 6 : 0));
  const brandability = Math.min(30, 10 + vowelCount * 2 + (label.length <= 10 ? 10 : 0));
  const seo = keywords.length
    ? keywords.some((keyword) => label.includes(keyword))
      ? 15
      : 6
    : 10;
  const intentKeywords = filters.category !== "any" ? CATEGORY_KEYWORDS[filters.category] ?? [] : [];
  const intent = intentKeywords.some((term) => label.includes(term))
    ? 10
    : label.split("").some((char) => vowels.has(char))
    ? 7
    : 5;
  const memorable = Math.min(15, 6 + (label.length <= 9 ? 6 : 2));

  const scores: DomainScores = {
    brandability,
    pronounceability,
    seo,
    length: lengthScore,
    clean: cleanScore,
    intent,
    memorable,
  };

  const score = Math.min(
    100,
    Math.round(
      scores.brandability +
        scores.pronounceability +
        scores.seo +
        scores.length +
        scores.clean +
        scores.intent +
        scores.memorable
    )
  );

  return { score, scores };
}

export function buildTags(label: string, scores: DomainScores, keywords: string[]) {
  const tags: string[] = [];
  if (label.length <= 8) tags.push("Short");
  if (scores.brandability >= 22) tags.push("Brandable");
  if (scores.pronounceability >= 16) tags.push("Pronounceable");
  if (scores.seo >= 12 && keywords.length > 0) tags.push("SEO");
  if (label.includes("ai") || label.includes("io")) tags.push("Tech");
  return tags.slice(0, 4);
}

export function passesFilters(candidate: Candidate, filters: SearchFilters, keywords: string[]) {
  const label = candidate.label;

  if (label.length < filters.lengthMin || label.length > filters.lengthMax) return false;
  if (filters.wordCount.length > 0 && !filters.wordCount.includes(candidate.words.length)) return false;
  if (!filters.allowHyphen && label.includes("-")) return false;
  if (!filters.allowDigits && /\d/.test(label)) return false;
  if (filters.startsWith && !label.startsWith(cleanWord(filters.startsWith))) return false;
  if (filters.endsWith && !label.endsWith(cleanWord(filters.endsWith))) return false;
  if (filters.excludeWords.some((word) => word && label.includes(cleanWord(word)))) return false;
  if (filters.avoidLetters.some((letter) => letter && label.includes(letter.toLowerCase()))) return false;
  if (filters.noDoubleLetters && /(.)\1/.test(label)) return false;
  if (filters.noTripleConsonants && consonantCluster.test(label)) return false;
  if (filters.noRepeats && /(.)\1\1/.test(label)) return false;
  if (filters.pronouncable && !isPronounceable(label)) return false;
  if (filters.keywordExact && keywords.length > 0 && !label.includes(keywords[0])) return false;

  if (filters.style !== "any") {
    const styleTerms = STYLE_TAGS[filters.style] ?? [];
    if (!styleTerms.some((term) => label.includes(term))) return false;
  }

  if (filters.tone !== "any") {
    const toneTerms = TONE_TAGS[filters.tone] ?? [];
    if (!toneTerms.some((term) => label.includes(term))) return false;
  }

  if (filters.keywordPosition !== "any" && keywords.length > 0) {
    const keyword = keywords[0];
    const index = label.indexOf(keyword);
    if (index === -1) return false;
    if (filters.keywordPosition === "start" && index !== 0) return false;
    if (filters.keywordPosition === "end" && index + keyword.length !== label.length) return false;
    if (filters.keywordPosition === "middle" && (index === 0 || index + keyword.length === label.length)) {
      return false;
    }
  }

  return true;
}

export function buildResultPayload({
  label,
  tld,
  keywords,
  filters,
}: {
  label: string;
  tld: string;
  keywords: string[];
  filters: SearchFilters;
}): { score: number; scores: DomainScores; tags: string[] } {
  const { score, scores } = scoreCandidate(label, keywords, filters);
  const tags = buildTags(label, scores, keywords);
  return { score, scores, tags };
}

export function applyScoreFilters(result: DomainResult, filters: SearchFilters) {
  if (result.scores.brandability < filters.brandMin) return false;
  if (result.scores.memorable < filters.memorableMin) return false;
  if (result.scores.seo < filters.seoMin) return false;
  if (result.score < filters.globalMin) return false;
  if (filters.maxBudget > 0 && result.priceEstimate && result.priceEstimate > filters.maxBudget) return false;
  return true;
}

export function sortResults(results: DomainResult[], sort: string) {
  const sorted = [...results];
  switch (sort) {
    case "shortest":
      return sorted.sort((a, b) => a.label.length - b.label.length);
    case "brand":
      return sorted.sort((a, b) => b.scores.brandability - a.scores.brandability);
    case "premium":
      return sorted.sort((a, b) => b.score - a.score);
    case "keyword":
      return sorted.sort((a, b) => b.scores.seo - a.scores.seo);
    default:
      return sorted.sort((a, b) => b.score - a.score);
  }
}
