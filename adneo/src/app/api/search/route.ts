import { NextRequest } from "next/server";
import { generateDomainNames } from "@/lib/domain-generator";
import { scoreDomain } from "@/lib/domain-scorer";
import { checkDomainAvailability } from "@/lib/availability-checker";
import type { SearchFilters, DomainResult } from "@/types/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  // Parse request body
  const body = await request.json();
  const {
    query,
    mode,
    extensions,
    filters,
  }: {
    query: string;
    mode: "smart" | "exact" | "batch";
    extensions: string[];
    filters: SearchFilters;
  } = body;

  // Validate input
  if (!query || query.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Query is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!extensions || extensions.length === 0) {
    return new Response(
      JSON.stringify({ error: "At least one extension is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: object) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        // Step 1: Generate domain names
        sendEvent("progress", {
          step: "Generating",
          message: "Generating name ideas...",
          percentage: 5,
        });

        const keywords = query.toLowerCase().split(/[\s,]+/).filter(Boolean);
        const names = generateDomainNames(query, mode, filters, 500);

        sendEvent("log", { message: `Generating name ideas... (${names.length} created)` });
        sendEvent("progress", {
          step: "Normalizing",
          message: `Normalizing & deduplicating...`,
          percentage: 15,
        });

        // Remove duplicates
        const uniqueNames = [...new Set(names)];
        sendEvent("log", { message: `Normalizing & deduplicating... (${uniqueNames.length} unique)` });

        // Step 2: Create domain + TLD combinations
        const totalDomains = uniqueNames.length * extensions.length;
        sendEvent("progress", {
          step: "Preparing",
          message: `Preparing ${totalDomains} domain combinations...`,
          percentage: 20,
        });
        sendEvent("log", { 
          message: `Checking availability... (${uniqueNames.length} domains / ${extensions.length} TLDs)` 
        });

        // Step 3: Score and check availability
        let checked = 0;
        let available = 0;
        const concurrency = 20;
        const batches: string[][] = [];

        // Create all domain combinations
        const allDomains: { name: string; tld: string; domain: string }[] = [];
        for (const name of uniqueNames) {
          for (const tld of extensions) {
            allDomains.push({ name, tld, domain: name + tld });
          }
        }

        // Split into batches
        for (let i = 0; i < allDomains.length; i += concurrency) {
          batches.push(allDomains.slice(i, i + concurrency).map((d) => d.domain));
        }

        // Process batches
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex];

          // Check availability for batch
          const batchResults = await Promise.all(
            batch.map(async (domain) => {
              const status = await checkDomainAvailability(domain);
              return { domain, status };
            })
          );

          // Process results
          for (const { domain, status } of batchResults) {
            checked++;
            const percentage = Math.round(20 + (checked / allDomains.length) * 70);

            if (status === "available") {
              available++;

              // Find the domain details
              const domainInfo = allDomains.find((d) => d.domain === domain);
              if (domainInfo) {
                // Score the domain
                const scoredDomain = scoreDomain(
                  domainInfo.name,
                  domainInfo.tld,
                  keywords,
                  filters
                );

                // Apply filter for minimum global score
                if (scoredDomain.score >= filters.minGlobalScore) {
                  // Update status to available
                  scoredDomain.status = "available";
                  
                  // Send the result
                  sendEvent("result", scoredDomain);
                }
              }
            }

            // Update progress every 10 checks
            if (checked % 10 === 0 || checked === allDomains.length) {
              sendEvent("progress", {
                step: "Checking",
                message: `Checked ${checked}/${allDomains.length} domains (${available} available)`,
                percentage,
              });
            }
          }
        }

        // Step 4: Complete
        sendEvent("log", { message: `Scoring & filtering...` });
        sendEvent("progress", {
          step: "Finalizing",
          message: "Finalizing results...",
          percentage: 95,
        });

        sendEvent("log", { message: `Done — ${available} available domains found` });
        sendEvent("progress", {
          step: "Complete",
          message: `Search complete! Found ${available} available domains.`,
          percentage: 100,
        });

        sendEvent("complete", { total: available });

        controller.close();
      } catch (error) {
        console.error("Search error:", error);
        sendEvent("error", { 
          message: error instanceof Error ? error.message : "An error occurred" 
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
