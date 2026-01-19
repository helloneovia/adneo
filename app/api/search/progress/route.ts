import { NextRequest } from "next/server";
import { SearchProgress } from "@/lib/types";

// SSE endpoint pour la progression en temps réel
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: SearchProgress) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Simulation de progression
      // En production, cela serait connecté à la queue réelle
      send({
        stage: "generating",
        progress: 10,
        message: "Génération des idées de noms...",
        details: { generated: 0 },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      send({
        stage: "normalizing",
        progress: 30,
        message: "Normalisation et déduplication...",
        details: { unique: 0 },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      send({
        stage: "checking",
        progress: 50,
        message: "Vérification de disponibilité...",
        details: { checking: { current: 0, total: 0, tlds: 0 } },
      });

      // Simuler progression checking
      for (let i = 1; i <= 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        send({
          stage: "checking",
          progress: 50 + (i * 3),
          message: "Vérification de disponibilité...",
          details: { checking: { current: i * 10, total: 100, tlds: 12 } },
        });
      }

      send({
        stage: "scoring",
        progress: 85,
        message: "Calcul des scores...",
        details: { scored: 0 },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      send({
        stage: "filtering",
        progress: 95,
        message: "Filtrage des résultats...",
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      send({
        stage: "done",
        progress: 100,
        message: "Recherche terminée",
        details: { available: 0 },
      });

      controller.close();
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
