import type { DomainResult, SearchFilters } from "@/types/domain";
import { isPronounceableName } from "./domain-generator";

const VOWELS = ["a", "e", "i", "o", "u"];

// Calculate brandability score (0-30)
function calculateBrandabilityScore(name: string): number {
  let score = 15; // Start at 50%

  // Length bonus (5-8 chars is ideal)
  if (name.length >= 5 && name.length <= 8) {
    score += 8;
  } else if (name.length >= 4 && name.length <= 10) {
    score += 4;
  } else if (name.length > 15) {
    score -= 5;
  }

  // Starts with strong consonant bonus
  const strongStarts = ["b", "c", "d", "f", "g", "k", "m", "n", "p", "s", "t", "v", "z"];
  if (strongStarts.includes(name[0]?.toLowerCase())) {
    score += 3;
  }

  // Ends with vowel or 'y' bonus (easier to pronounce/remember)
  const lastChar = name[name.length - 1]?.toLowerCase();
  if (VOWELS.includes(lastChar) || lastChar === "y") {
    score += 3;
  }

  // Has good vowel/consonant ratio (40-60% vowels)
  const vowelCount = (name.match(/[aeiou]/gi) || []).length;
  const vowelRatio = vowelCount / name.length;
  if (vowelRatio >= 0.3 && vowelRatio <= 0.5) {
    score += 4;
  }

  // Penalize numbers
  if (/\d/.test(name)) {
    score -= 5;
  }

  // Penalize hyphens
  if (name.includes("-")) {
    score -= 3;
  }

  // Bonus for no repeated letters
  if (!/(.)\1/.test(name)) {
    score += 2;
  }

  return Math.max(0, Math.min(30, score));
}

// Calculate pronounceability score (0-20)
function calculatePronounceabilityScore(name: string): number {
  if (!isPronounceableName(name)) {
    return 5;
  }

  let score = 12;

  // Consonant clusters
  const consonantClusters = name.match(/[bcdfghjklmnpqrstvwxyz]{2,}/gi) || [];
  const maxCluster = Math.max(...consonantClusters.map((c) => c.length), 0);
  if (maxCluster <= 2) {
    score += 5;
  } else if (maxCluster === 3) {
    score += 2;
  }

  // Easy sound patterns
  const easySounds = ["th", "ch", "sh", "wh", "ph", "ck", "ng", "nk"];
  for (const sound of easySounds) {
    if (name.toLowerCase().includes(sound)) {
      score += 1;
      break;
    }
  }

  // Syllable structure (alternating consonant-vowel is easiest)
  const pattern = name
    .toLowerCase()
    .split("")
    .map((c) => (VOWELS.includes(c) ? "v" : "c"))
    .join("");
  if (/^(cv)+c?$/.test(pattern) || /^c?(vc)+$/.test(pattern)) {
    score += 3;
  }

  return Math.max(0, Math.min(20, score));
}

// Calculate SEO keyword fit (0-15)
function calculateSeoScore(name: string, keywords: string[]): number {
  if (keywords.length === 0) {
    return 8; // Neutral score if no keywords
  }

  let score = 0;
  const lowerName = name.toLowerCase();

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();

    if (lowerName === lowerKeyword) {
      // Exact match
      score = 15;
      break;
    } else if (lowerName.startsWith(lowerKeyword)) {
      // Starts with keyword
      score = Math.max(score, 13);
    } else if (lowerName.includes(lowerKeyword)) {
      // Contains keyword
      score = Math.max(score, 10);
    } else if (lowerKeyword.split("").every((c) => lowerName.includes(c))) {
      // Contains all letters
      score = Math.max(score, 5);
    }
  }

  return score;
}

// Calculate length score (0-15)
function calculateLengthScore(name: string): number {
  const len = name.length;

  // Ideal lengths
  if (len >= 4 && len <= 6) return 15;
  if (len >= 3 && len <= 8) return 13;
  if (len >= 9 && len <= 10) return 10;
  if (len >= 11 && len <= 12) return 7;
  if (len >= 13 && len <= 15) return 4;
  return 2;
}

// Calculate clean characters score (0-10)
function calculateCleanCharactersScore(name: string): number {
  let score = 10;

  // Penalize numbers
  const digitCount = (name.match(/\d/g) || []).length;
  score -= digitCount * 2;

  // Penalize hyphens
  const hyphenCount = (name.match(/-/g) || []).length;
  score -= hyphenCount * 2;

  // Penalize uncommon letters
  const uncommonCount = (name.match(/[qxz]/gi) || []).length;
  score -= uncommonCount;

  // Bonus for all lowercase letters
  if (/^[a-z]+$/.test(name)) {
    score += 1;
  }

  return Math.max(0, Math.min(10, score));
}

// Calculate business intent match (0-10)
function calculateBusinessIntentScore(
  name: string,
  categories: string[],
  style: string[]
): number {
  let score = 5; // Neutral start

  const lowerName = name.toLowerCase();

  // Category-specific keywords
  const categoryKeywords: Record<string, string[]> = {
    SaaS: ["cloud", "app", "soft", "ware", "hub", "stack", "flow"],
    Finance: ["pay", "fund", "coin", "cash", "fin", "money", "trade", "invest"],
    Health: ["fit", "health", "well", "vita", "care", "med", "life"],
    Ecommerce: ["shop", "store", "buy", "sell", "cart", "deal", "market"],
    Crypto: ["chain", "block", "token", "coin", "nft", "defi", "dao"],
    DevTools: ["dev", "code", "git", "api", "sdk", "cli", "ops"],
    Marketing: ["ads", "seo", "social", "brand", "grow", "lead", "viral"],
    "Real Estate": ["home", "estate", "prop", "rent", "house", "land"],
    Education: ["learn", "edu", "study", "skill", "course", "teach"],
    "AI/ML": ["ai", "ml", "neural", "bot", "auto", "smart", "intel"],
  };

  // Check if name matches any category keywords
  for (const category of categories) {
    const keywords = categoryKeywords[category] || [];
    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        score += 3;
        break;
      }
    }
  }

  // Style-specific patterns
  const stylePatterns: Record<string, RegExp[]> = {
    Startup: [/hub$/, /ly$/, /ify$/, /io$/, /app$/],
    Corporate: [/solutions$/, /systems$/, /group$/, /corp$/],
    Fun: [/oo/, /ee/, /y$/, /o$/],
    Luxury: [/^(le|la|el)/, /gold/, /prime/, /elite/],
    Minimal: [/^[a-z]{3,5}$/],
    Tech: [/ai$/, /io$/, /tech$/, /dev$/, /code/],
    Creative: [/studio$/, /design$/, /art/, /pixel/],
  };

  for (const s of style) {
    const patterns = stylePatterns[s] || [];
    for (const pattern of patterns) {
      if (pattern.test(lowerName)) {
        score += 2;
        break;
      }
    }
  }

  return Math.max(0, Math.min(10, score));
}

// Generate tags for a domain
function generateTags(
  name: string,
  scores: DomainResult["scores"],
  totalScore: number
): string[] {
  const tags: string[] = [];

  // Length-based tags
  if (name.length <= 5) tags.push("Short");
  if (name.length <= 4) tags.push("Ultra-short");
  if (name.length >= 12) tags.push("Long");

  // Score-based tags
  if (scores.brandability >= 25) tags.push("Brandable");
  if (scores.pronounceability >= 17) tags.push("Easy to say");
  if (scores.seoKeywordFit >= 12) tags.push("SEO Strong");
  if (scores.cleanCharacters >= 9) tags.push("Clean");
  if (totalScore >= 80) tags.push("Premium");
  if (totalScore >= 70) tags.push("High Quality");

  // Pattern-based tags
  if (/ai$/i.test(name)) tags.push("AI");
  if (/io$/i.test(name)) tags.push("Tech");
  if (/hub$/i.test(name)) tags.push("Hub");
  if (/cloud$/i.test(name)) tags.push("Cloud");
  if (/app$/i.test(name)) tags.push("App");
  if (/labs?$/i.test(name)) tags.push("Labs");

  // Style tags
  if (/ly$/i.test(name) || /ify$/i.test(name)) tags.push("Startup");
  if (/^(get|try|go|use)/i.test(name)) tags.push("Action");

  return tags.slice(0, 4); // Limit to 4 tags
}

export function scoreDomain(
  name: string,
  tld: string,
  keywords: string[],
  filters: SearchFilters
): DomainResult {
  const domain = name + tld;

  const scores = {
    brandability: calculateBrandabilityScore(name),
    pronounceability: calculatePronounceabilityScore(name),
    seoKeywordFit: calculateSeoScore(name, keywords),
    lengthScore: calculateLengthScore(name),
    cleanCharacters: calculateCleanCharactersScore(name),
    businessIntent: calculateBusinessIntentScore(name, filters.categories, filters.style),
  };

  const totalScore =
    scores.brandability +
    scores.pronounceability +
    scores.seoKeywordFit +
    scores.lengthScore +
    scores.cleanCharacters +
    scores.businessIntent;

  const tags = generateTags(name, scores, totalScore);

  // TLD bonus - .com is premium
  let adjustedScore = totalScore;
  if (tld === ".com") adjustedScore += 5;
  else if ([".io", ".ai", ".co"].includes(tld)) adjustedScore += 3;
  else if ([".app", ".dev", ".tech"].includes(tld)) adjustedScore += 2;

  return {
    id: `${domain}-${Date.now()}`,
    domain,
    name,
    tld,
    status: "checking",
    score: Math.min(100, adjustedScore),
    scores,
    tags,
    buyUrl: `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(domain)}`,
  };
}

export function sortDomains(
  domains: DomainResult[],
  sortBy: string
): DomainResult[] {
  return [...domains].sort((a, b) => {
    switch (sortBy) {
      case "shortest":
        return a.name.length - b.name.length;
      case "brandScore":
        return b.scores.brandability - a.scores.brandability;
      case "premium":
        return b.score - a.score;
      case "keyword":
        return b.scores.seoKeywordFit - a.scores.seoKeywordFit;
      case "bestMatch":
      default:
        return b.score - a.score;
    }
  });
}
