import { NextRequest, NextResponse } from "next/server";
import { DomainGenerator } from "@/lib/domain-generator";
import { DomainScorer } from "@/lib/domain-scorer";
import { AvailabilityChecker } from "@/lib/availability-checker";
import { SearchRequest, SearchResult, FinalDomainResult } from "@/lib/types";

export const maxDuration = 60; // 60 secondes max

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json();

    // Génération
    const generator = new DomainGenerator({
      allowHyphens: body.options.allowHyphens,
      allowDigits: body.options.allowDigits,
      maxLength: body.options.maxLength || 20,
      minLength: body.options.minLength || 3,
      excludeWords: body.options.excludeWords,
    });

    let candidates = [];
    if (body.mode === "exact") {
      // Mode exact: juste les mots-clés avec les TLDs
      candidates = body.keywords.flatMap((keyword) =>
        body.tlds.map((tld) => ({
          name: keyword.toLowerCase(),
          tld,
          fullDomain: `${keyword.toLowerCase()}${tld}`,
        }))
      );
    } else {
      // Mode smart: génération de variantes
      candidates = generator.generate(body.keywords, body.tlds);
    }

    // Limiter à 2000 candidats max
    if (candidates.length > 2000) {
      candidates = candidates.slice(0, 2000);
    }

    // Scoring
    const scorer = new DomainScorer({
      keywords: body.keywords,
      category: body.options.category,
      style: body.options.style,
      tone: body.options.tone,
      minBrandScore: body.options.minBrandScore,
      minMemorableScore: body.options.minMemorableScore,
    });

    const scored = candidates.map((c) => scorer.score(c));

    // Filtrage par score
    const filtered = scored.filter((s) => {
      if (body.options.minBrandScore && s.score.brandability < body.options.minBrandScore) {
        return false;
      }
      if (body.options.minMemorableScore) {
        const memorable = s.score.brandability + s.score.pronounceability;
        if (memorable < body.options.minMemorableScore) {
          return false;
        }
      }
      return true;
    });

    // Vérification disponibilité
    const checker = new AvailabilityChecker();
    const availabilityResults = await checker.checkBatch(filtered);

    // Filtrer uniquement les disponibles
    const available = availabilityResults.filter((r) => r.status === "available");
    const availableDomains = new Set(available.map((a) => `${a.domain}${a.tld}`));

    // Combiner scored + availability
    const finalResults: FinalDomainResult[] = filtered
      .filter((s) => availableDomains.has(s.fullDomain))
      .map((s) => {
        const avail = available.find((a) => a.domain === s.name && a.tld === s.tld);
        return {
          ...s,
          availability: avail!,
        };
      });

    const result: SearchResult = {
      domains: filtered,
      available: available,
      finalResults: finalResults,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche" },
      { status: 500 }
    );
  }
}
