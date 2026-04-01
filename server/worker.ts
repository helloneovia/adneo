import { getQueue } from "./queue";
import { runSubmission } from "./automation";
import { getAnnouncementById, getLogsBySubmission, updateSubmissionStatus } from "./db";
import { notifyOwner } from "./_core/notification";

export async function startWorker() {
  const boss = await getQueue();
  if (!boss) return;

  // Listen to 'submission' jobs
  // Concurrency: 2 to avoid memory overload with Chromium
  await boss.work('submission', { teamSize: 2, teamConcurrency: 2 }, async (job: any) => {
    const { submissionId, targetSites, logIds, announcementId, userId } = job.data as any;
    
    console.log(`[Worker] Started submission #${submissionId}`);
    try {
      const announcement = await getAnnouncementById(announcementId, userId);
      if (!announcement) throw new Error("Annonce introuvable pendant le job");
      
      await runSubmission(submissionId, announcement, targetSites, logIds);
      
      const logs = await getLogsBySubmission(submissionId);
      const allSuccess = logs.every((l) => l.status === "success");
      const anyFailed = logs.some((l) => l.status === "failed");
      const status = allSuccess ? "completed" : anyFailed ? "failed" : "completed";
      
      await updateSubmissionStatus(submissionId, status, { completedAt: new Date() });

      if (anyFailed) {
        await notifyOwner({
          title: "ADNEO — Échec de dépôt d'annonce",
          content: `La soumission #${submissionId} de l'utilisateur #${userId} a échoué sur certains sites.`,
        });
      }

      console.log(`[Worker] Completed submission #${submissionId}`);
    } catch (err: any) {
      console.error(`[Worker] Error in submission #${submissionId}:`, err);
      await updateSubmissionStatus(submissionId, "failed", { completedAt: new Date() });
      await notifyOwner({
        title: "ADNEO — Erreur critique de soumission",
        content: `Soumission #${submissionId} : ${err.message}`,
      });
      // Optionally we don't throw so it doesn't infinite retry,
      // or we throw and configure pg-boss not to retry
    }
  });

  console.log('[Worker] Started listening for "submission" jobs');
}
