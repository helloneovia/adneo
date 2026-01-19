import { DomainCandidate } from "./domain-generator";

export interface DomainScore {
  brandability: number; // 0-30
  pronounceability: number; // 0-20
  seoKeywordFit: number; // 0-15
  lengthScore: number; // 0-15
  cleanCharacters: number; // 0-10
  businessIntent: number; // 0-10
  total: number; // 0-100
}

export interface ScoredDomain extends DomainCandidate {
  score: DomainScore;
  tags: string[];
}

export interface ScoringOptions {
  keywords?: string[];
  category?: string;
  style?: string;
  tone?: string;
  minBrandScore?: number;
  minMemorableScore?: number;
  excludeAwkwardLetters?: boolean;
}

/**
 * Système de scoring pour évaluer la qualité des domaines
 */
export class DomainScorer {
  private options: ScoringOptions;

  constructor(options: ScoringOptions = {}) {
    this.options = options;
  }

  score(candidate: DomainCandidate): ScoredDomain {
    const name = candidate.name;
    const score: DomainScore = {
      brandability: this.calculateBrandability(name),
      pronounceability: this.calculatePronounceability(name),
      seoKeywordFit: this.calculateSEOKeywordFit(name),
      lengthScore: this.calculateLengthScore(name),
      cleanCharacters: this.calculateCleanCharacters(name),
      businessIntent: this.calculateBusinessIntent(name),
      total: 0,
    };

    score.total = Object.values(score).reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0);

    const tags = this.generateTags(candidate, score);

    return {
      ...candidate,
      score,
      tags,
    };
  }

  private calculateBrandability(name: string): number {
    let score = 15; // Base

    // Bonus pour longueur optimale (5-10 caractères)
    if (name.length >= 5 && name.length <= 10) {
      score += 5;
    }

    // Bonus pour voyelles équilibrées
    const vowels = (name.match(/[aeiou]/gi) || []).length;
    const vowelRatio = vowels / name.length;
    if (vowelRatio >= 0.3 && vowelRatio <= 0.5) {
      score += 5;
    }

    // Bonus pour pas de caractères difficiles
    if (!/[qxz]/i.test(name)) {
      score += 5;
    }

    return Math.min(30, score);
  }

  private calculatePronounceability(name: string): number {
    let score = 10; // Base

    // Vérifier alternance voyelles/consonnes
    let alternates = true;
    for (let i = 1; i < name.length; i++) {
      const prev = /[aeiou]/i.test(name[i - 1]);
      const curr = /[aeiou]/i.test(name[i]);
      if (prev === curr && i > 1) {
        alternates = false;
        break;
      }
    }

    if (alternates) {
      score += 5;
    }

    // Pas de 3 consonnes consécutives
    if (!/[bcdfghjklmnpqrstvwxyz]{3,}/i.test(name)) {
      score += 5;
    }

    return Math.min(20, score);
  }

  private calculateSEOKeywordFit(name: string): number {
    if (!this.options.keywords || this.options.keywords.length === 0) {
      return 7; // Score neutre
    }

    let score = 0;
    const nameLower = name.toLowerCase();

    for (const keyword of this.options.keywords) {
      const keywordLower = keyword.toLowerCase();
      if (nameLower.includes(keywordLower)) {
        // Bonus si au début
        if (nameLower.startsWith(keywordLower)) {
          score += 8;
        } else if (nameLower.includes(keywordLower)) {
          score += 5;
        }
      }
    }

    return Math.min(15, score);
  }

  private calculateLengthScore(name: string): number {
    // Optimal: 6-12 caractères
    if (name.length >= 6 && name.length <= 12) {
      return 15;
    }
    // Bon: 4-5 ou 13-15
    if ((name.length >= 4 && name.length <= 5) || (name.length >= 13 && name.length <= 15)) {
      return 10;
    }
    // Acceptable: 3 ou 16-18
    if (name.length === 3 || (name.length >= 16 && name.length <= 18)) {
      return 5;
    }
    // Trop court ou trop long
    return 0;
  }

  private calculateCleanCharacters(name: string): number {
    let score = 10;

    // Pénalité pour caractères difficiles
    if (/[qxz]/i.test(name)) {
      score -= 3;
    }

    // Pénalité pour répétitions (aaa, bbb)
    if (/(.)\1{2,}/.test(name)) {
      score -= 5;
    }

    // Bonus pour pas de caractères spéciaux
    if (/^[a-z0-9]+$/i.test(name)) {
      score += 2;
    }

    return Math.max(0, Math.min(10, score));
  }

  private calculateBusinessIntent(name: string): number {
    let score = 5; // Base

    // Mots-clés business
    const businessKeywords = [
      "hub", "labs", "studio", "cloud", "app", "pro", "plus", "tech", "dev",
      "build", "make", "create", "find", "get", "go", "try", "use",
    ];

    for (const keyword of businessKeywords) {
      if (name.includes(keyword)) {
        score += 2;
        break;
      }
    }

    return Math.min(10, score);
  }

  private generateTags(candidate: DomainCandidate, score: DomainScore): string[] {
    const tags: string[] = [];

    if (score.brandability >= 25) {
      tags.push("Brandable");
    }
    if (candidate.name.length <= 6) {
      tags.push("Short");
    }
    if (score.pronounceability >= 18) {
      tags.push("Pronounceable");
    }
    if (candidate.tld === ".com" || candidate.tld === ".io" || candidate.tld === ".ai") {
      tags.push("Tech");
    }
    if (score.total >= 80) {
      tags.push("Premium");
    }

    return tags;
  }
}
