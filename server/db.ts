import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  announcements,
  apiConfig,
  submissionLogs,
  submissions,
  templates,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
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

export async function createAnnouncement(data: typeof announcements.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(announcements).values(data);
  return result[0];
}

export async function updateAnnouncement(
  id: number,
  userId: number,
  data: Partial<typeof announcements.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .update(announcements)
    .set(data)
    .where(and(eq(announcements.id, id), eq(announcements.userId, userId)));
}

export async function deleteAnnouncement(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
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

export async function createTemplate(data: typeof templates.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(templates).values(data);
}

export async function updateTemplate(
  id: number,
  userId: number,
  data: Partial<typeof templates.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .update(templates)
    .set(data)
    .where(and(eq(templates.id, id), eq(templates.userId, userId)));
}

export async function deleteTemplate(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
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

export async function getSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  return result[0];
}

export async function getAllSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(submissions).orderBy(desc(submissions.createdAt));
}

export async function createSubmission(data: typeof submissions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(submissions).values(data);
  return result[0];
}

export async function updateSubmissionStatus(
  id: number,
  status: "pending" | "running" | "completed" | "failed",
  extra?: { startedAt?: Date; completedAt?: Date }
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .update(submissions)
    .set({ overallStatus: status, ...extra })
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

export async function createSubmissionLog(data: typeof submissionLogs.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(submissionLogs).values(data);
  return result[0];
}

export async function updateSubmissionLog(
  id: number,
  data: Partial<typeof submissionLogs.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(submissionLogs).set(data).where(eq(submissionLogs.id, id));
}

// ─── API Config ───────────────────────────────────────────────────────────────
export async function getAllApiConfigs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(apiConfig).orderBy(apiConfig.key);
}

export async function getApiConfigByKey(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(apiConfig).where(eq(apiConfig.key, key)).limit(1);
  return result[0];
}

export async function upsertApiConfig(
  key: string,
  value: string,
  description?: string,
  isSecret = true
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .insert(apiConfig)
    .values({ key, value, description, isSecret })
    .onDuplicateKeyUpdate({ set: { value, description } });
}

export async function deleteApiConfig(key: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(apiConfig).where(eq(apiConfig.key, key));
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export async function getGlobalStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalAnnouncements: 0, totalSubmissions: 0 };
  const [uCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [aCount] = await db.select({ count: sql<number>`count(*)` }).from(announcements);
  const [sCount] = await db.select({ count: sql<number>`count(*)` }).from(submissions);
  return {
    totalUsers: Number(uCount?.count ?? 0),
    totalAnnouncements: Number(aCount?.count ?? 0),
    totalSubmissions: Number(sCount?.count ?? 0),
  };
}
