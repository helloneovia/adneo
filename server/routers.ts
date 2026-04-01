import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SUPPORTED_SITES, runSubmission } from "./automation";
import {
  createAnnouncement,
  createSubmission,
  createSubmissionLog,
  createTemplate,
  deleteAnnouncement,
  deleteApiConfig,
  deleteTemplate,
  getAllApiConfigs,
  getAllSubmissions,
  getAllUsers,
  getAnnouncementById,
  getAnnouncementsByUser,
  getGlobalStats,
  getLogsBySubmission,
  getSubmissionById,
  getSubmissionsByUser,
  getTemplateById,
  getTemplatesByUser,
  updateAnnouncement,
  updateSubmissionStatus,
  updateTemplate,
  updateUserRole,
  upsertApiConfig,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

// ─── Admin guard ──────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès réservé aux administrateurs" });
  }
  return next({ ctx });
});

// ─── Announcement schema ──────────────────────────────────────────────────────
const announcementInput = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10),
  price: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  location: z.string().optional().nullable(),
  imageUrls: z.array(z.string().url()).optional().nullable(),
  variables: z.record(z.string(), z.string()).optional().nullable(),
  templateId: z.number().optional().nullable(),
});

// ─── Template schema ──────────────────────────────────────────────────────────
const templateInput = z.object({
  name: z.string().min(1).max(255),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  location: z.string().optional().nullable(),
  imageUrls: z.array(z.string().url()).optional().nullable(),
  variables: z.record(z.string(), z.string()).optional().nullable(),
});

export const appRouter = router({
  system: systemRouter,

  // ─── Auth ──────────────────────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Sites ─────────────────────────────────────────────────────────────────
  sites: router({
    list: publicProcedure.query(() => SUPPORTED_SITES),
  }),

  // ─── Announcements ─────────────────────────────────────────────────────────
  announcements: router({
    list: protectedProcedure.query(({ ctx }) => getAnnouncementsByUser(ctx.user.id)),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const item = await getAnnouncementById(input.id, ctx.user.id);
        if (!item) throw new TRPCError({ code: "NOT_FOUND" });
        return item;
      }),

    create: protectedProcedure.input(announcementInput).mutation(async ({ ctx, input }) => {
      await createAnnouncement({ ...input, userId: ctx.user.id });
      return { success: true };
    }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: announcementInput }))
      .mutation(async ({ ctx, input }) => {
        await updateAnnouncement(input.id, ctx.user.id, input.data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteAnnouncement(input.id, ctx.user.id);
        return { success: true };
      }),

    uploadImage: protectedProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          base64: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        const key = `announcements/${ctx.user.id}/${Date.now()}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url };
      }),
  }),

  // ─── Templates ─────────────────────────────────────────────────────────────
  templates: router({
    list: protectedProcedure.query(({ ctx }) => getTemplatesByUser(ctx.user.id)),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const item = await getTemplateById(input.id, ctx.user.id);
        if (!item) throw new TRPCError({ code: "NOT_FOUND" });
        return item;
      }),

    create: protectedProcedure.input(templateInput).mutation(async ({ ctx, input }) => {
      await createTemplate({ ...input, userId: ctx.user.id });
      return { success: true };
    }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: templateInput }))
      .mutation(async ({ ctx, input }) => {
        await updateTemplate(input.id, ctx.user.id, input.data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteTemplate(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ─── Submissions ───────────────────────────────────────────────────────────
  submissions: router({
    list: protectedProcedure.query(({ ctx }) => getSubmissionsByUser(ctx.user.id)),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const sub = await getSubmissionById(input.id);
        if (!sub || sub.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND" });
        const logs = await getLogsBySubmission(sub.id);
        return { ...sub, logs };
      }),

    submit: protectedProcedure
      .input(
        z.object({
          announcementId: z.number(),
          targetSites: z.array(z.string()).min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const announcement = await getAnnouncementById(input.announcementId, ctx.user.id);
        if (!announcement) throw new TRPCError({ code: "NOT_FOUND", message: "Annonce introuvable" });

        // Créer la soumission
        await createSubmission({
          userId: ctx.user.id,
          announcementId: input.announcementId,
          targetSites: input.targetSites,
          overallStatus: "running",
          startedAt: new Date(),
        });

        // Récupérer l'ID de la soumission créée
        const userSubs = await getSubmissionsByUser(ctx.user.id);
        const newSub = userSubs[0];
        if (!newSub) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        // Créer les logs par site
        const logIds: Record<string, number> = {};
        for (const site of input.targetSites) {
          await createSubmissionLog({
            submissionId: newSub.id,
            site,
            status: "pending",
          });
          const siteLogs = await getLogsBySubmission(newSub.id);
          const siteLog = siteLogs.find((l) => l.site === site);
          if (siteLog) logIds[site] = siteLog.id;
        }

        // Lancer l'automatisation en arrière-plan
        runSubmission(newSub.id, announcement, input.targetSites, logIds)
          .then(async () => {
            const logs = await getLogsBySubmission(newSub.id);
            const allSuccess = logs.every((l) => l.status === "success");
            const anyFailed = logs.some((l) => l.status === "failed");
            const status = allSuccess ? "completed" : anyFailed ? "failed" : "completed";
            await updateSubmissionStatus(newSub.id, status, { completedAt: new Date() });

            if (anyFailed) {
              await notifyOwner({
                title: "ADNEO — Échec de dépôt d'annonce",
                content: `La soumission #${newSub.id} de l'utilisateur #${ctx.user.id} a échoué sur certains sites.`,
              });
            }
          })
          .catch(async (err) => {
            await updateSubmissionStatus(newSub.id, "failed", { completedAt: new Date() });
            await notifyOwner({
              title: "ADNEO — Erreur critique de soumission",
              content: `Soumission #${newSub.id} : ${err.message}`,
            });
          });

        return { submissionId: newSub.id };
      }),

    getLogs: protectedProcedure
      .input(z.object({ submissionId: z.number() }))
      .query(async ({ ctx, input }) => {
        const sub = await getSubmissionById(input.submissionId);
        if (!sub || sub.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND" });
        return getLogsBySubmission(input.submissionId);
      }),

    getDetails: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const sub = await getSubmissionById(input.id);
        if (!sub || sub.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND" });
        const siteLogs = await getLogsBySubmission(sub.id);
        // Build results map: { [site]: { status, message, url } }
        const results: Record<string, { status: string; message?: string; url?: string }> = {};
        for (const log of siteLogs) {
          results[log.site] = {
            status: log.status,
            message: log.errorMessage ?? undefined,
            url: log.externalUrl ?? undefined,
          };
        }
        // Flatten all logs
        const allLogs = siteLogs.flatMap((l) => (l.logs as string[] | null) ?? []);
        return { ...sub, results, logs: allLogs };
      }),
  }),

  // ─── Admin ─────────────────────────────────────────────────────────────────
  admin: router({
    stats: adminProcedure.query(() => getGlobalStats()),

    users: router({
      list: adminProcedure.query(() => getAllUsers()),
      setRole: adminProcedure
        .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
        .mutation(async ({ input }) => {
          await updateUserRole(input.userId, input.role);
          return { success: true };
        }),
    }),

    submissions: router({
      list: adminProcedure.query(() => getAllSubmissions()),
      getLogs: adminProcedure
        .input(z.object({ submissionId: z.number() }))
        .query(({ input }) => getLogsBySubmission(input.submissionId)),
    }),

    config: router({
      list: adminProcedure.query(async () => {
        const configs = await getAllApiConfigs();
        // Masquer les valeurs secrètes
        return configs.map((c) => ({
          ...c,
          value: c.isSecret && c.value ? "••••••••" : c.value,
        }));
      }),

      listRaw: adminProcedure.query(() => getAllApiConfigs()),

      upsert: adminProcedure
        .input(
          z.object({
            key: z.string().min(1),
            value: z.string(),
            description: z.string().optional(),
            isSecret: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          await upsertApiConfig(input.key, input.value, input.description, input.isSecret ?? true);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ key: z.string() }))
        .mutation(async ({ input }) => {
          await deleteApiConfig(input.key);
          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
