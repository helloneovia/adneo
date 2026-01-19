import { DomainResult } from "@/lib/types";

const CACHE_TTL_MS = 1000 * 60 * 30;
const PROVIDER = "GoDaddy";

type AvailabilityStatus = "available" | "taken" | "unknown";

interface AvailabilityCacheEntry {
  status: AvailabilityStatus;
  checkedAt: number;
}

const globalForCache = globalThis as unknown as {
  __adneoAvailabilityCache?: Map<string, AvailabilityCacheEntry>;
};

const availabilityCache =
  globalForCache.__adneoAvailabilityCache ??
  new Map<string, AvailabilityCacheEntry>();

globalForCache.__adneoAvailabilityCache = availabilityCache;

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function estimatePrice(label: string, score: number) {
  const base = 12 + Math.max(0, 20 - label.length);
  const rarity = Math.max(0, (100 - score) / 2);
  return Math.round(base + rarity);
}

export function buildBuyUrl(domain: string) {
  return `https://www.godaddy.com/domainsearch/find?domainToCheck=${domain}`;
}

export async function checkAvailability(domain: string) {
  const cached = availabilityCache.get(domain);
  const now = Date.now();

  if (cached && now - cached.checkedAt < CACHE_TTL_MS) {
    return { status: cached.status, checkedAt: cached.checkedAt };
  }

  const seed = hashString(domain);
  let status: AvailabilityStatus = "taken";

  if (seed % 17 === 0) {
    status = "unknown";
  } else if (seed % 5 === 0) {
    status = "available";
  }

  availabilityCache.set(domain, { status, checkedAt: now });

  return { status, checkedAt: now };
}

export function buildResult({
  label,
  tld,
  score,
  scores,
  tags,
  checkedAt,
  priceEstimate,
}: {
  label: string;
  tld: string;
  score: number;
  scores: DomainResult["scores"];
  tags: string[];
  checkedAt: number;
  priceEstimate?: number;
}): DomainResult {
  const domain = `${label}${tld}`;
  const adjustedPrice =
    priceEstimate ?? estimatePrice(label, score + (label.length > 8 ? -8 : 0));
  return {
    domain,
    label,
    tld,
    status: "available",
    score,
    scores,
    tags,
    priceEstimate: adjustedPrice,
    buyUrl: buildBuyUrl(domain),
    checkedAt: new Date(checkedAt).toISOString(),
    provider: PROVIDER,
  };
}
