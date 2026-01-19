const WINDOW_MS = 1000 * 60 * 60 * 24;
const MAX_REQUESTS = 5;

interface RateEntry {
  count: number;
  resetAt: number;
}

const globalForRate = globalThis as unknown as {
  __adneoRateLimit?: Map<string, RateEntry>;
};

const rateStore = globalForRate.__adneoRateLimit ?? new Map<string, RateEntry>();
globalForRate.__adneoRateLimit = rateStore;

export function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateStore.get(ip);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + WINDOW_MS;
    const next = { count: 1, resetAt };
    rateStore.set(ip, next);
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  rateStore.set(ip, entry);
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
}
