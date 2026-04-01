/**
 * Service d'automatisation ADNEO
 * Intègre Capmonster (résolution CAPTCHA) et 5sim (vérification SMS)
 * pour soumettre des annonces sur les sites cibles.
 */

import { getApiConfigByKey, updateSubmissionLog } from "./db";

export const SUPPORTED_SITES = [
  { id: "paruvendu", label: "ParuVendu.fr", url: "https://www.paruvendu.fr" },
  { id: "topannonces", label: "Topannonces.fr", url: "https://www.topannonces.fr" },
  { id: "entreparticuliers", label: "Entreparticuliers.com", url: "https://www.entreparticuliers.com" },
  { id: "vivastreet", label: "Vivastreet.com", url: "https://www.vivastreet.com" },
  { id: "pap", label: "PAP.fr", url: "https://www.pap.fr" },
] as const;

export type SiteId = (typeof SUPPORTED_SITES)[number]["id"];

export interface AnnouncementData {
  title: string;
  description: string;
  price?: string | null;
  category?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  location?: string | null;
  imageUrls?: string[] | null;
  variables?: Record<string, string> | null;
}

// ─── Capmonster ───────────────────────────────────────────────────────────────
async function resolveCapmonsterCaptcha(
  apiKey: string,
  websiteUrl: string,
  websiteKey: string,
  type: "RecaptchaV2Task" | "CloudflareTask" = "RecaptchaV2Task"
): Promise<string> {
  const createRes = await fetch("https://api.capmonster.cloud/createTask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientKey: apiKey,
      task: { type, websiteURL: websiteUrl, websiteKey },
    }),
  });
  const createData = await createRes.json() as { taskId?: number; errorId?: number };
  if (createData.errorId || !createData.taskId) {
    throw new Error(`Capmonster createTask failed: ${JSON.stringify(createData)}`);
  }

  // Polling jusqu'à résolution (max 120s)
  for (let i = 0; i < 24; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const resultRes = await fetch("https://api.capmonster.cloud/getTaskResult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientKey: apiKey, taskId: createData.taskId }),
    });
    const resultData = await resultRes.json() as { status?: string; solution?: { gRecaptchaResponse?: string }; errorId?: number };
    if (resultData.status === "ready" && resultData.solution?.gRecaptchaResponse) {
      return resultData.solution.gRecaptchaResponse;
    }
    if (resultData.errorId) {
      throw new Error(`Capmonster getTaskResult error: ${JSON.stringify(resultData)}`);
    }
  }
  throw new Error("Capmonster timeout: captcha not resolved in 120s");
}

// ─── 5sim ─────────────────────────────────────────────────────────────────────
async function get5simNumber(apiKey: string, country = "france", product = "other") {
  const res = await fetch(
    `https://5sim.net/v1/user/buy/activation/${country}/any/${product}`,
    { headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`5sim buy number failed: ${res.status}`);
  const data = await res.json() as { id?: number; phone?: string };
  if (!data.id || !data.phone) throw new Error("5sim: invalid response");
  return { orderId: data.id, phone: data.phone };
}

async function wait5simSms(apiKey: string, orderId: number, maxWaitMs = 120000): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await fetch(`https://5sim.net/v1/user/check/${orderId}`, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
    });
    const data = await res.json() as { sms?: Array<{ text?: string }> };
    if (data.sms && data.sms.length > 0) {
      const text = data.sms[0]?.text ?? "";
      const match = text.match(/\d{4,8}/);
      if (match) return match[0];
    }
  }
  throw new Error("5sim: SMS not received within timeout");
}

async function cancel5simOrder(apiKey: string, orderId: number) {
  await fetch(`https://5sim.net/v1/user/cancel/${orderId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
  });
}

// ─── Soumission par site ──────────────────────────────────────────────────────
async function submitToSite(
  siteId: SiteId,
  announcement: AnnouncementData,
  logId: number,
  capmonsterKey: string | null,
  fiveSimKey: string | null
): Promise<{ success: boolean; url?: string; error?: string; logs: string[] }> {
  const logs: string[] = [];

  const addLog = (msg: string) => {
    logs.push(`[${new Date().toISOString()}] ${msg}`);
  };

  addLog(`Démarrage de la soumission sur ${siteId}`);

  // Simulation / stub — à remplacer par les vrais scripts Playwright
  // selon la plateforme cible
  try {
    switch (siteId) {
      case "paruvendu": {
        addLog("Connexion à ParuVendu.fr...");
        if (!fiveSimKey) throw new Error("Clé API 5sim manquante (requise pour ParuVendu)");
        addLog("Récupération d'un numéro virtuel via 5sim...");
        // const { orderId, phone } = await get5simNumber(fiveSimKey);
        // addLog(`Numéro obtenu : ${phone}`);
        addLog("[SIMULATION] Formulaire pré-rempli avec les données de l'annonce");
        addLog("[SIMULATION] Code SMS reçu et validé");
        addLog("[SIMULATION] Annonce soumise avec succès");
        return { success: true, url: "https://www.paruvendu.fr/annonce/simulation", logs };
      }

      case "topannonces": {
        addLog("Connexion à Topannonces.fr...");
        addLog("[SIMULATION] Formulaire pré-rempli avec les données de l'annonce");
        addLog("[SIMULATION] Annonce soumise — en attente de modération");
        return { success: true, url: "https://www.topannonces.fr/annonce/simulation", logs };
      }

      case "entreparticuliers": {
        addLog("Connexion à Entreparticuliers.com...");
        addLog("[SIMULATION] Formulaire immobilier pré-rempli");
        addLog("[SIMULATION] Annonce soumise avec succès");
        return { success: true, url: "https://www.entreparticuliers.com/annonce/simulation", logs };
      }

      case "vivastreet": {
        addLog("Connexion à Vivastreet.com...");
        if (!capmonsterKey) throw new Error("Clé API Capmonster manquante (requise pour Vivastreet)");
        addLog("Résolution du challenge Cloudflare via Capmonster...");
        // const token = await resolveCapmonsterCaptcha(capmonsterKey, "https://www.vivastreet.com", "sitekey");
        addLog("[SIMULATION] Challenge Cloudflare résolu");
        addLog("[SIMULATION] Formulaire pré-rempli et soumis");
        return { success: true, url: "https://www.vivastreet.com/annonce/simulation", logs };
      }

      case "pap": {
        addLog("PAP.fr est un site payant avec CGU restrictives");
        addLog("[AVERTISSEMENT] La soumission automatique sur PAP.fr n'est pas supportée");
        return { success: false, error: "PAP.fr non supporté (site payant, CGU restrictives)", logs };
      }

      default:
        throw new Error(`Site non supporté : ${siteId}`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    addLog(`ERREUR : ${msg}`);
    return { success: false, error: msg, logs };
  }
}

// ─── Orchestrateur principal ──────────────────────────────────────────────────
export async function runSubmission(
  submissionId: number,
  announcement: AnnouncementData,
  targetSites: string[],
  logIds: Record<string, number>
): Promise<void> {
  const capmonsterConfig = await getApiConfigByKey("CAPMONSTER_API_KEY");
  const fiveSimConfig = await getApiConfigByKey("5SIM_API_KEY");

  const capmonsterKey = capmonsterConfig?.value ?? null;
  const fiveSimKey = fiveSimConfig?.value ?? null;

  // Soumission parallèle sur tous les sites
  await Promise.all(
    targetSites.map(async (siteId) => {
      const logId = logIds[siteId];
      if (!logId) return;

      await updateSubmissionLog(logId, { status: "running", startedAt: new Date() });

      const result = await submitToSite(
        siteId as SiteId,
        announcement,
        logId,
        capmonsterKey,
        fiveSimKey
      );

      await updateSubmissionLog(logId, {
        status: result.success ? "success" : "failed",
        externalUrl: result.url,
        errorMessage: result.error,
        logs: result.logs,
        completedAt: new Date(),
      });
    })
  );
}
