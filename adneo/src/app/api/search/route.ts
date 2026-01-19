import { checkRateLimit } from "@/lib/rateLimit";
import { runSearch, normalizeFilters } from "@/lib/search";
import { ALL_TLDS, TLD_PACKS } from "@/lib/tlds";
import { SearchMode } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseTlds(raw: string | null) {
  if (!raw) return TLD_PACKS.top;
  if (raw === "all") return ALL_TLDS;
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseFilters(raw: string | null) {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const mode = (searchParams.get("mode") ?? "smart") as SearchMode;
  const tlds = parseTlds(searchParams.get("tlds"));
  const filters = normalizeFilters(parseFilters(searchParams.get("filters")));

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";
  const rate = checkRateLimit(ip);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      if (!query) {
        sendEvent("error", { message: "Search query required." });
        controller.close();
        return;
      }

      if (!rate.allowed) {
        sendEvent("error", {
          message: "Daily quota reached. Try again later.",
          resetAt: rate.resetAt,
        });
        controller.close();
        return;
      }

      sendEvent("progress", {
        stage: "generate",
        percent: 3,
        message: "Starting search...",
        detail: `Quota remaining: ${rate.remaining}`,
      });

      for await (const event of runSearch({
        query,
        mode,
        tlds: tlds.length > 0 ? tlds : TLD_PACKS.top,
        filters,
        signal: request.signal,
      })) {
        if (request.signal.aborted) break;
        sendEvent(event.type, event.payload);
      }

      controller.close();
    },
    cancel() {},
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
