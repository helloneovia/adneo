import { PREMIUM_PREFIXES, PREMIUM_SUFFIXES } from "./constants";

export interface DomainCandidate {
  name: string;
  tld: string;
  fullDomain: string;
}

export interface GenerationOptions {
  allowHyphens?: boolean;
  allowDigits?: boolean;
  maxLength?: number;
  minLength?: number;
  excludeWords?: string[];
}

/**
 * Génère des variantes de noms de domaines à partir de mots-clés
 */
export class DomainGenerator {
  private options: GenerationOptions;

  constructor(options: GenerationOptions = {}) {
    this.options = {
      allowHyphens: false,
      allowDigits: false,
      maxLength: 20,
      minLength: 3,
      excludeWords: [],
      ...options,
    };
  }

  /**
   * Génère une liste de candidats de domaines
   */
  generate(keywords: string[], tlds: string[]): DomainCandidate[] {
    const candidates: DomainCandidate[] = [];
    const normalizedKeywords = this.normalizeKeywords(keywords);

    // 1. Concaténation directe
    candidates.push(...this.generateConcatenations(normalizedKeywords, tlds));

    // 2. Préfixes premium
    candidates.push(...this.generateWithPrefixes(normalizedKeywords, tlds));

    // 3. Suffixes premium
    candidates.push(...this.generateWithSuffixes(normalizedKeywords, tlds));

    // 4. Variantes brandables (voyelles modifiées, doubles consonnes limitées)
    candidates.push(...this.generateBrandableVariants(normalizedKeywords, tlds));

    // 5. Abréviations
    candidates.push(...this.generateAbbreviations(normalizedKeywords, tlds));

    // 6. Combinaisons préfixe + mot + suffixe
    candidates.push(...this.generateFullCombinations(normalizedKeywords, tlds));

    // Déduplication et filtrage
    return this.deduplicateAndFilter(candidates);
  }

  private normalizeKeywords(keywords: string[]): string[] {
    return keywords
      .map((k) => k.toLowerCase().trim())
      .filter((k) => k.length > 0)
      .map((k) => k.replace(/[^a-z0-9]/g, ""));
  }

  private generateConcatenations(keywords: string[], tlds: string[]): DomainCandidate[] {
    const candidates: DomainCandidate[] = [];

    if (keywords.length === 1) {
      const word = keywords[0];
      for (const tld of tlds) {
        candidates.push({
          name: word,
          tld,
          fullDomain: `${word}${tld}`,
        });
      }
    } else {
      // Toutes les combinaisons de 2 mots
      for (let i = 0; i < keywords.length; i++) {
        for (let j = i + 1; j < keywords.length; j++) {
          const combined = keywords[i] + keywords[j];
          for (const tld of tlds) {
            candidates.push({
              name: combined,
              tld,
              fullDomain: `${combined}${tld}`,
            });
          }
        }
      }
    }

    return candidates;
  }

  private generateWithPrefixes(keywords: string[], tlds: string[]): DomainCandidate[] {
    const candidates: DomainCandidate[] = [];

    for (const keyword of keywords) {
      for (const prefix of PREMIUM_PREFIXES) {
        const name = prefix + keyword;
        for (const tld of tlds) {
          candidates.push({
            name,
            tld,
            fullDomain: `${name}${tld}`,
          });
        }
      }
    }

    return candidates;
  }

  private generateWithSuffixes(keywords: string[], tlds: string[]): DomainCandidate[] {
    const candidates: DomainCandidate[] = [];

    for (const keyword of keywords) {
      for (const suffix of PREMIUM_SUFFIXES) {
        const name = keyword + suffix;
        for (const tld of tlds) {
          candidates.push({
            name,
            tld,
            fullDomain: `${name}${tld}`,
          });
        }
      }
    }

    return candidates;
  }

  private generateBrandableVariants(keywords: string[], tlds: string[]): DomainCandidate[] {
    const candidates: DomainCandidate[] = [];

    for (const keyword of keywords) {
      // Variantes simples : double consonne (limitée)
      if (keyword.length > 3) {
        const variants = [
          keyword + keyword[keyword.length - 1], // double dernière lettre
          keyword.slice(0, -1) + keyword[keyword.length - 1] + keyword[keyword.length - 1],
        ];

        for (const variant of variants) {
          for (const tld of tlds) {
            candidates.push({
              name: variant,
              tld,
              fullDomain: `${variant}${tld}`,
            });
          }
        }
      }
    }

    return candidates;
  }

  private generateAbbreviations(keywords: string[], tlds: string[]): DomainCandidate[] {
    const candidates: DomainCandidate[] = [];

    for (const keyword of keywords) {
      if (keyword.length > 4) {
        // Première lettre + reste
        const abbrev = keyword[0] + keyword.slice(2);
        for (const tld of tlds) {
          candidates.push({
            name: abbrev,
            tld,
            fullDomain: `${abbrev}${tld}`,
          });
        }
      }
    }

    return candidates;
  }

  private generateFullCombinations(keywords: string[], tlds: string[]): DomainCandidate[] {
    const candidates: DomainCandidate[] = [];

    // Limiter pour éviter explosion combinatoire
    const limitedPrefixes = PREMIUM_PREFIXES.slice(0, 10);
    const limitedSuffixes = PREMIUM_SUFFIXES.slice(0, 10);

    for (const keyword of keywords.slice(0, 2)) {
      for (const prefix of limitedPrefixes) {
        for (const suffix of limitedSuffixes) {
          const name = prefix + keyword + suffix;
          for (const tld of tlds) {
            candidates.push({
              name,
              tld,
              fullDomain: `${name}${tld}`,
            });
          }
        }
      }
    }

    return candidates;
  }

  private deduplicateAndFilter(candidates: DomainCandidate[]): DomainCandidate[] {
    const seen = new Set<string>();
    const filtered: DomainCandidate[] = [];

    for (const candidate of candidates) {
      // Vérifier longueur
      if (candidate.name.length < this.options.minLength! || candidate.name.length > this.options.maxLength!) {
        continue;
      }

      // Vérifier tirets
      if (!this.options.allowHyphens && candidate.name.includes("-")) {
        continue;
      }

      // Vérifier chiffres
      if (!this.options.allowDigits && /\d/.test(candidate.name)) {
        continue;
      }

      // Vérifier mots exclus
      if (this.options.excludeWords?.some((word) => candidate.name.includes(word))) {
        continue;
      }

      // Déduplication
      if (!seen.has(candidate.fullDomain)) {
        seen.add(candidate.fullDomain);
        filtered.push(candidate);
      }
    }

    return filtered;
  }
}
