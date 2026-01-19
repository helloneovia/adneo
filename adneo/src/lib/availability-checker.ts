import type { DomainResult, DomainStatus } from "@/types/domain";

// Simulated availability checker
// In production, this would call real DNS/WHOIS APIs or registrar APIs

// Cache for checked domains
const availabilityCache = new Map<string, { status: DomainStatus; checkedAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Simulate API rate limiting
let lastCheckTime = 0;
const MIN_CHECK_INTERVAL = 50; // ms between checks

// Common words/patterns that are usually taken
const LIKELY_TAKEN_PATTERNS = [
  /^(google|facebook|amazon|apple|microsoft|twitter|netflix)/i,
  /^(app|web|cloud|tech|digital|online|smart|mobile)$/i,
  /^[a-z]{2,3}$/i, // 2-3 letter domains are usually taken
  /^(shop|store|buy|sell|pay|bank|money|cash)$/i,
  /^(news|blog|mail|chat|video|music|game)$/i,
];

// Patterns that are more likely to be available
const LIKELY_AVAILABLE_PATTERNS = [
  /\d{3,}/,
  /[a-z]{10,}/i,
  /hub$/i,
  /labs$/i,
  /flow$/i,
  /stack$/i,
];

function getFromCache(domain: string): DomainStatus | null {
  const cached = availabilityCache.get(domain);
  if (cached && Date.now() - cached.checkedAt < CACHE_TTL) {
    return cached.status;
  }
  return null;
}

function setCache(domain: string, status: DomainStatus): void {
  availabilityCache.set(domain, { status, checkedAt: Date.now() });
}

// Simulate availability check with realistic patterns
function simulateAvailabilityCheck(domain: string): DomainStatus {
  const name = domain.split(".")[0].toLowerCase();
  const tld = "." + domain.split(".").slice(1).join(".");

  // Check cache first
  const cached = getFromCache(domain);
  if (cached) return cached;

  // Simulate realistic availability
  // Most short .com domains are taken
  if (tld === ".com" && name.length <= 5) {
    // 90% chance taken for short .com
    const status = Math.random() > 0.1 ? "taken" : "available";
    setCache(domain, status);
    return status;
  }

  // Check if matches common taken patterns
  for (const pattern of LIKELY_TAKEN_PATTERNS) {
    if (pattern.test(name)) {
      const status = Math.random() > 0.15 ? "taken" : "available";
      setCache(domain, status);
      return status;
    }
  }

  // Check if matches likely available patterns
  for (const pattern of LIKELY_AVAILABLE_PATTERNS) {
    if (pattern.test(name)) {
      const status = Math.random() > 0.7 ? "taken" : "available";
      setCache(domain, status);
      return status;
    }
  }

  // TLD affects availability
  let availabilityChance = 0.35; // Base 35% chance available

  // Premium TLDs have lower availability
  if (tld === ".com") availabilityChance = 0.25;
  if (tld === ".net" || tld === ".org") availabilityChance = 0.35;
  if (tld === ".io" || tld === ".ai") availabilityChance = 0.45;
  if ([".dev", ".app", ".tech", ".cloud"].includes(tld)) availabilityChance = 0.55;
  if ([".xyz", ".site", ".online", ".store"].includes(tld)) availabilityChance = 0.65;
  if ([".studio", ".design", ".agency"].includes(tld)) availabilityChance = 0.7;

  // Longer names are more likely available
  if (name.length > 8) availabilityChance += 0.15;
  if (name.length > 12) availabilityChance += 0.1;

  // Names with suffixes like 'hub', 'labs' are more likely available
  if (/hub$|labs$|studio$|flow$|stack$|base$/i.test(name)) {
    availabilityChance += 0.2;
  }

  // Add some randomness based on the domain name itself
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  availabilityChance += ((hash % 20) - 10) / 100;

  const status = Math.random() < availabilityChance ? "available" : "taken";
  setCache(domain, status);
  return status;
}

export async function checkDomainAvailability(domain: string): Promise<DomainStatus> {
  // Simulate rate limiting
  const now = Date.now();
  const timeSinceLastCheck = now - lastCheckTime;
  if (timeSinceLastCheck < MIN_CHECK_INTERVAL) {
    await new Promise((resolve) => setTimeout(resolve, MIN_CHECK_INTERVAL - timeSinceLastCheck));
  }
  lastCheckTime = Date.now();

  // Simulate network delay (50-200ms)
  const delay = 50 + Math.random() * 150;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Simulate occasional failures (5% chance)
  if (Math.random() < 0.05) {
    return "unknown";
  }

  return simulateAvailabilityCheck(domain);
}

export async function checkDomainsInBatch(
  domains: string[],
  concurrency: number = 10,
  onProgress?: (checked: number, total: number, result: { domain: string; status: DomainStatus }) => void
): Promise<Map<string, DomainStatus>> {
  const results = new Map<string, DomainStatus>();
  let checked = 0;
  const total = domains.length;

  // Process in batches with controlled concurrency
  for (let i = 0; i < domains.length; i += concurrency) {
    const batch = domains.slice(i, i + concurrency);

    const batchResults = await Promise.all(
      batch.map(async (domain) => {
        const status = await checkDomainAvailability(domain);
        return { domain, status };
      })
    );

    for (const { domain, status } of batchResults) {
      results.set(domain, status);
      checked++;
      onProgress?.(checked, total, { domain, status });
    }
  }

  return results;
}

export function updateDomainStatus(
  domains: DomainResult[],
  statusMap: Map<string, DomainStatus>
): DomainResult[] {
  return domains.map((domain) => ({
    ...domain,
    status: statusMap.get(domain.domain) || domain.status,
    checkedAt: Date.now(),
  }));
}
