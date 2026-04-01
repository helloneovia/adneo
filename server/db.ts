import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  InsertSession,
  InsertUser,
  announcements,
  apiConfig,
  sessions,
  submissionLogs,
  submissions,
  templates,
  users,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Detect if SSL is needed: external URLs (with SSL params or non-local hosts) use SSL, internal Docker networks don't
      const dbUrl = process.env.DATABASE_URL;
      const needsSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('ssl=true') || dbUrl.includes('neon.tech') || dbUrl.includes('supabase');
      const client = postgres(dbUrl, needsSsl ? { ssl: { rejectUnauthorized: false } } : { ssl: false });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function createUser(data: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

export async function updateUserLastSignedIn(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function createSession(data: InsertSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(sessions).values(data);
}

export async function getSessionWithUser(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, sessionId), sql`${sessions.expiresAt} > NOW()`))
    .limit(1);
  return result[0];
}

export async function deleteSession(sessionId: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function deleteExpiredSessions() {
  const db = await getDb();
  if (!db) return;
  await db.delete(sessions).where(sql`${sessions.expiresAt} <= NOW()`);
}

// ─── Announcements ────────────────────────────────────────────────────────────

export async function getAnnouncementsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(announcements)
    .where(eq(announcements.userId, userId))
    .orderBy(desc(announcements.createdAt));
}

export async function getAnnouncementById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(announcements)
    .where(and(eq(announcements.id, id), eq(announcements.userId, userId)))
    .limit(1);
  return result[0];
}

export async function createAnnouncement(
  data: Omit<typeof announcements.$inferInsert, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(announcements).values(data);
}

export async function updateAnnouncement(
  id: number,
  userId: number,
  data: Partial<typeof announcements.$inferInsert>
) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(announcements)
    .set(data)
    .where(and(eq(announcements.id, id), eq(announcements.userId, userId)));
}

export async function deleteAnnouncement(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .delete(announcements)
    .where(and(eq(announcements.id, id), eq(announcements.userId, userId)));
}

// ─── Templates ────────────────────────────────────────────────────────────────

export async function getTemplatesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(templates)
    .where(eq(templates.userId, userId))
    .orderBy(desc(templates.createdAt));
}

export async function getTemplateById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(templates)
    .where(and(eq(templates.id, id), eq(templates.userId, userId)))
    .limit(1);
  return result[0];
}

export async function createTemplate(
  data: Omit<typeof templates.$inferInsert, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(templates).values(data);
}

export async function updateTemplate(
  id: number,
  userId: number,
  data: Partial<typeof templates.$inferInsert>
) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(templates)
    .set(data)
    .where(and(eq(templates.id, id), eq(templates.userId, userId)));
}

export async function deleteTemplate(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .delete(templates)
    .where(and(eq(templates.id, id), eq(templates.userId, userId)));
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export async function getSubmissionsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.userId, userId))
    .orderBy(desc(submissions.createdAt));
}

export async function getAllSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(submissions).orderBy(desc(submissions.createdAt));
}

export async function getSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  return result[0];
}

export async function createSubmission(
  data: Omit<typeof submissions.$inferInsert, "id" | "createdAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(submissions).values(data);
}

export async function updateSubmissionStatus(
  id: number,
  status: "pending" | "running" | "completed" | "failed",
  extra?: { completedAt?: Date }
) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(submissions)
    .set({ overallStatus: status, ...(extra ?? {}) })
    .where(eq(submissions.id, id));
}

// ─── Submission Logs ──────────────────────────────────────────────────────────

export async function getLogsBySubmission(submissionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(submissionLogs)
    .where(eq(submissionLogs.submissionId, submissionId))
    .orderBy(submissionLogs.site);
}

export async function createSubmissionLog(
  data: Omit<typeof submissionLogs.$inferInsert, "id" | "createdAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(submissionLogs).values(data);
}

export async function updateSubmissionLog(
  id: number,
  data: Partial<typeof submissionLogs.$inferInsert>
) {
  const db = await getDb();
  if (!db) return;
  await db.update(submissionLogs).set(data).where(eq(submissionLogs.id, id));
}

// ─── API Config ───────────────────────────────────────────────────────────────

export async function getAllApiConfigs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(apiConfig).orderBy(apiConfig.key);
}

export async function upsertApiConfig(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(apiConfig)
    .values({ key, value, description })
    .onConflictDoUpdate({ target: apiConfig.key, set: { value, ...(description ? { description } : {}) } });
}

export async function deleteApiConfig(key: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(apiConfig).where(eq(apiConfig.key, key));
}

export async function getApiConfigByKey(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(apiConfig).where(eq(apiConfig.key, key)).limit(1);
  return result[0];
}

// ─── Global Stats ─────────────────────────────────────────────────────────────

export async function getGlobalStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalSubmissions: 0, totalAnnouncements: 0 };

  const [[userCount], [subCount], [annCount]] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(users),
    db.select({ count: sql<number>`COUNT(*)` }).from(submissions),
    db.select({ count: sql<number>`COUNT(*)` }).from(announcements),
  ]);

  return {
    totalUsers: Number(userCount?.count ?? 0),
    totalSubmissions: Number(subCount?.count ?? 0),
    totalAnnouncements: Number(annCount?.count ?? 0),
  };
}
