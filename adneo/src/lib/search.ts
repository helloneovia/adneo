import { checkAvailability, buildResult } from "@/lib/availability";
import {
  applyScoreFilters,
  buildResultPayload,
  dedupeCandidates,
  defaultFilters,
  generateCandidates,
  passesFilters,
} from "@/lib/domain";
import { SearchEvent, SearchFilters, SearchMode } from "@/lib/types";

const MAX_CANDIDATES = 900;
const MAX_DOMAINS = 3600;
const CONCURRENCY = 20;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function normalizeFilters(filters?: Partial<SearchFilters>): SearchFilters {
  return { ...defaultFilters, ...(filters ?? {}) };
}

export async function* runSearch({
  query,
  mode,
  tlds,
  filters,
  signal,
}: {
  query: string;
  mode: SearchMode;
  tlds: string[];
  filters: SearchFilters;
  signal?: AbortSignal;
}): AsyncGenerator<SearchEvent> {
  const start = Date.now();
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

  yield {
    type: "progress",
    payload: {
      stage: "generate",
      percent: 8,
      message: "Generating name ideas...",
    },
  };

  const rawCandidates = generateCandidates(query, mode);
  const candidates = dedupeCandidates(rawCandidates, MAX_CANDIDATES);

  yield {
    type: "progress",
    payload: {
      stage: "normalize",
      percent: 18,
      message: "Normalizing & deduplicating...",
      created: candidates.length,
      detail: `${candidates.length} unique candidates`,
    },
  };

  const eligible = candidates.filter((candidate) => passesFilters(candidate, filters, keywords));
  const domains = eligible
    .flatMap((candidate) =>
      tlds.map((tld) => ({ label: candidate.label, tld, words: candidate.words }))
    )
    .slice(0, MAX_DOMAINS);

  let checked = 0;
  let available = 0;

  yield {
    type: "progress",
    payload: {
      stage: "check",
      percent: 22,
      message: "Checking availability...",
      total: domains.length,
      detail: `${domains.length} domains / ${tlds.length} TLDs`,
    },
  };

  for (let i = 0; i < domains.length; i += CONCURRENCY) {
    if (signal?.aborted) break;
    const batch = domains.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const domain = `${item.label}${item.tld}`;
        const availability = await checkAvailability(domain);
        return { ...item, domain, availability };
      })
    );

    for (const item of batchResults) {
      checked += 1;
      if (item.availability.status === "available") {
        const { score, scores, tags } = buildResultPayload({
          label: item.label,
          tld: item.tld,
          keywords,
          filters,
        });

        const result = buildResult({
          label: item.label,
          tld: item.tld,
          score,
          scores,
          tags,
          checkedAt: item.availability.checkedAt,
        });

        if (!applyScoreFilters(result, filters)) continue;

        available += 1;
        yield { type: "result", payload: result };
      }
    }

    const percent = Math.min(92, Math.round(22 + (checked / Math.max(1, domains.length)) * 68));
    yield {
      type: "progress",
      payload: {
        stage: "check",
        percent,
        message: "Checking availability...",
        checked,
        total: domains.length,
        available,
        detail: `${checked}/${domains.length} checked`,
      },
    };

    await sleep(40);
  }

  yield {
    type: "progress",
    payload: {
      stage: "score",
      percent: 97,
      message: "Scoring & filtering...",
      available,
    },
  };

  yield {
    type: "done",
    payload: {
      available,
      durationMs: Date.now() - start,
    },
  };
}
