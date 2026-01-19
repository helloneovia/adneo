import { ScoredDomain } from "./domain-scorer";

/**
 * Estime le prix d'un domaine basé sur ses caractéristiques
 * Les domaines premium GoDaddy sont généralement :
 * - Courts (3-6 caractères) : $100-$10,000+
 * - Score élevé (>80) : $50-$5,000+
 * - Extensions rares (.io, .ai) : $20-$500
 * - Extensions communes (.com) : $10-$1000
 */
export function estimateGoDaddyPrice(domain: ScoredDomain): number | null {
  const { name, tld, score } = domain;
  const length = name.length;
  
  // Prix de base selon l'extension
  let basePrice = 12; // Prix standard .com
  
  if (tld === ".com") {
    basePrice = 12;
  } else if (tld === ".io") {
    basePrice = 40;
  } else if (tld === ".ai") {
    basePrice = 70;
  } else if (tld === ".app" || tld === ".dev") {
    basePrice = 20;
  } else if (tld === ".net" || tld === ".org") {
    basePrice = 15;
  } else {
    basePrice = 10; // Autres extensions
  }
  
  // Multiplicateur selon la longueur
  let lengthMultiplier = 1;
  if (length <= 3) {
    lengthMultiplier = 50; // Très courts = premium
  } else if (length <= 4) {
    lengthMultiplier = 20;
  } else if (length <= 5) {
    lengthMultiplier = 5;
  } else if (length <= 6) {
    lengthMultiplier = 2;
  } else if (length <= 8) {
    lengthMultiplier = 1.2;
  }
  
  // Multiplicateur selon le score
  let scoreMultiplier = 1;
  if (score.total >= 90) {
    scoreMultiplier = 3;
  } else if (score.total >= 80) {
    scoreMultiplier = 2;
  } else if (score.total >= 70) {
    scoreMultiplier = 1.5;
  } else if (score.total >= 60) {
    scoreMultiplier = 1.2;
  }
  
  // Calcul du prix estimé
  const estimatedPrice = Math.round(basePrice * lengthMultiplier * scoreMultiplier);
  
  // Si le prix est très élevé (>1000), c'est probablement un domaine premium
  // On retourne null pour indiquer qu'il faut vérifier sur GoDaddy
  if (estimatedPrice > 1000) {
    return null; // Premium - prix à vérifier
  }
  
  return estimatedPrice;
}

export function formatPrice(price: number | null, currency: string = "USD"): string {
  if (price === null) {
    return "Premium";
  }
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
