import { DomainCandidate } from "./domain-generator";

export type AvailabilityStatus = "available" | "taken" | "unknown" | "checking";

export interface AvailabilityResult {
  domain: string;
  tld: string;
  status: AvailabilityStatus;
  checkedAt: Date;
  buyUrl: string;
}

/**
 * Vérifie la disponibilité d'un domaine
 * Note: Pour MVP, on simule. En production, utiliser une API réelle (GoDaddy, Namecheap, etc.)
 */
export class AvailabilityChecker {
  /**
   * Vérifie la disponibilité d'un domaine
   */
  async checkAvailability(candidate: DomainCandidate): Promise<AvailabilityResult> {
    // TODO: Implémenter la vraie vérification via API
    // Pour MVP, on simule avec une logique simple
    const status = this.simulateAvailability(candidate.fullDomain);

    return {
      domain: candidate.name,
      tld: candidate.tld,
      status,
      checkedAt: new Date(),
      buyUrl: this.generateGoDaddyUrl(candidate.fullDomain),
    };
  }

  /**
   * Vérifie plusieurs domaines en parallèle
   */
  async checkBatch(
    candidates: DomainCandidate[],
    onProgress?: (checked: number, total: number) => void
  ): Promise<AvailabilityResult[]> {
    const results: AvailabilityResult[] = [];
    const batchSize = 10;

    for (let i = 0; i < candidates.length; i += batchSize) {
      const batch = candidates.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((candidate) => this.checkAvailability(candidate))
      );
      results.push(...batchResults);

      if (onProgress) {
        onProgress(results.length, candidates.length);
      }

      // Rate limiting: attendre un peu entre les batches
      if (i + batchSize < candidates.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  private simulateAvailability(domain: string): AvailabilityStatus {
    // Simulation: domaines courts ou communs sont pris
    const commonDomains = [
      "test", "example", "demo", "admin", "www", "mail", "api", "app",
      "blog", "shop", "store", "buy", "sell", "get", "go", "try",
    ];

    const name = domain.split(".")[0];
    if (commonDomains.includes(name) || name.length <= 3) {
      return "taken";
    }

    // Simulation: 30% de chance d'être disponible
    return Math.random() > 0.7 ? "available" : "taken";
  }

  private generateGoDaddyUrl(domain: string): string {
    return `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(domain)}`;
  }
}
