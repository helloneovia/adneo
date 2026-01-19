import { DomainCandidate } from "./domain-generator";
import { promises as dns } from "dns";

export type AvailabilityStatus = "available" | "taken" | "unknown" | "checking";

export interface AvailabilityResult {
  domain: string;
  tld: string;
  status: AvailabilityStatus;
  checkedAt: Date;
  buyUrl: string;
}

/**
 * Vérifie la disponibilité d'un domaine en utilisant DNS lookup
 */
export class AvailabilityChecker {
  /**
   * Vérifie la disponibilité d'un domaine via DNS
   */
  async checkAvailability(candidate: DomainCandidate): Promise<AvailabilityResult> {
    try {
      const status = await this.checkDomainDNS(candidate.fullDomain);
      
      return {
        domain: candidate.name,
        tld: candidate.tld,
        status,
        checkedAt: new Date(),
        buyUrl: this.generateGoDaddyUrl(candidate.fullDomain),
      };
    } catch (error) {
      console.error(`Error checking ${candidate.fullDomain}:`, error);
      // En cas d'erreur, on considère comme "unknown" plutôt que "available"
      return {
        domain: candidate.name,
        tld: candidate.tld,
        status: "unknown",
        checkedAt: new Date(),
        buyUrl: this.generateGoDaddyUrl(candidate.fullDomain),
      };
    }
  }

  /**
   * Vérifie plusieurs domaines en parallèle avec rate limiting
   */
  async checkBatch(
    candidates: DomainCandidate[],
    onProgress?: (checked: number, total: number) => void
  ): Promise<AvailabilityResult[]> {
    const results: AvailabilityResult[] = [];
    const batchSize = 5; // Réduit pour éviter de surcharger DNS

    for (let i = 0; i < candidates.length; i += batchSize) {
      const batch = candidates.slice(i, i + batchSize);
      
      // Vérifier en parallèle avec timeout
      const batchResults = await Promise.allSettled(
        batch.map((candidate) => 
          Promise.race([
            this.checkAvailability(candidate),
            new Promise<AvailabilityResult>((_, reject) => 
              setTimeout(() => reject(new Error("Timeout")), 3000)
            )
          ])
        )
      );

      // Traiter les résultats
      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          results.push(result.value);
        } else {
          // En cas d'erreur, marquer comme unknown
          const index = batchResults.indexOf(result);
          if (index >= 0 && index < batch.length) {
            results.push({
              domain: batch[index].name,
              tld: batch[index].tld,
              status: "unknown",
              checkedAt: new Date(),
              buyUrl: this.generateGoDaddyUrl(batch[index].fullDomain),
            });
          }
        }
      }

      if (onProgress) {
        onProgress(results.length, candidates.length);
      }

      // Rate limiting: attendre entre les batches pour ne pas surcharger DNS
      if (i + batchSize < candidates.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    return results;
  }

  /**
   * Vérifie si un domaine existe via DNS lookup
   */
  private async checkDomainDNS(domain: string): Promise<AvailabilityStatus> {
    try {
      // Essayer de résoudre le domaine
      // Si on obtient une réponse DNS, le domaine existe (taken)
      // Si on obtient une erreur NXDOMAIN, le domaine est disponible
      
      await Promise.race([
        dns.resolve4(domain),
        dns.resolve6(domain),
        dns.resolveMx(domain),
        dns.resolveTxt(domain),
      ]);

      // Si on arrive ici, le domaine a des enregistrements DNS = il est pris
      return "taken";
    } catch (error: any) {
      // Vérifier le code d'erreur
      if (error.code === "ENOTFOUND" || error.code === "NXDOMAIN") {
        // Domaine non trouvé = disponible
        return "available";
      }
      
      // Autres erreurs (timeout, réseau, etc.) = unknown
      return "unknown";
    }
  }

  /**
   * Génère l'URL GoDaddy pour acheter le domaine
   */
  private generateGoDaddyUrl(domain: string): string {
    return `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(domain)}`;
  }
}
