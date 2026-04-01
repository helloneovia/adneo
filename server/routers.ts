import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SUPPORTED_SITES, runSubmission } from "./automation";
import {
  createAnnouncement,
  createSession,
  createSubmission,
  createSubmissionLog,
  createTemplate,
  createUser,
  deleteAnnouncement,
  deleteApiConfig,
  deleteSession,
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
  getUserByEmail,
  updateAnnouncement,
  updateSubmissionStatus,
  updateTemplate,
  updateUserLastSignedIn,
  updateUserRole,
  upsertApiConfig,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

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

// ─── Session helpers ──────────────────────────────────────────────────────────
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

async function issueSession(
  userId: number,
  req: Parameters<typeof getSessionCookieOptions>[0],
  res: { cookie: (name: string, value: string, options: object) => void }
) {
  const sessionId = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await createSession({ id: sessionId, userId, expiresAt });
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionId, {
    ...cookieOptions,
    maxAge: SESSION_DURATION_MS,
  });
  return sessionId;
}

export const appRouter = router({
  system: systemRouter,

  // ─── Auth ──────────────────────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),

    register: publicProcedure
      .input(
        z.object({
          name: z.string().min(2).max(255),
          email: z.string().email(),
          password: z.string().min(8).max(128),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existing = await getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Un compte existe déjà avec cet email.",
          });
        }

        const passwordHash = await bcrypt.hash(input.password, 12);
        const user = await createUser({
          email: input.email.toLowerCase(),
          name: input.name,
          passwordHash,
        });

        if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await issueSession(user.id, ctx.req, ctx.res);
        return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
      }),

    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await getUserByEmail(input.email);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email ou mot de passe incorrect.",
          });
        }

        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email ou mot de passe incorrect.",
          });
        }

        await updateUserLastSignedIn(user.id);
        await issueSession(user.id, ctx.req, ctx.res);
        return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
      }),

    logout: publicProcedure.mutation(async ({ ctx }) => {
      const sessionId = ctx.req.cookies?.[COOKIE_NAME];
      if (sessionId) {
        await deleteSession(sessionId);
      }
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

        await createSubmission({
          userId: ctx.user.id,
          announcementId: input.announcementId,
          targetSites: input.targetSites,
          overallStatus: "running",
          startedAt: new Date(),
        });

        const userSubs = await getSubmissionsByUser(ctx.user.id);
        const newSub = userSubs[0];
        if (!newSub) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

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
        const results: Record<string, { status: string; message?: string; url?: string }> = {};
        for (const log of siteLogs) {
          results[log.site] = {
            status: log.status,
            message: log.errorMessage ?? undefined,
            url: log.externalUrl ?? undefined,
          };
        }
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
        return configs.map((c) => ({
          ...c,
          value: c.isSecret ? (c.value ? "***" : null) : c.value,
        }));
      }),

      upsert: adminProcedure
        .input(
          z.object({
            key: z.string().min(1),
            value: z.string(),
            description: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          await upsertApiConfig(input.key, input.value, input.description);
          return { success: true };
        }),
      set: adminProcedure
        .input(
          z.object({
            key: z.string().min(1),
            value: z.string(),
            description: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          await upsertApiConfig(input.key, input.value, input.description);
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
