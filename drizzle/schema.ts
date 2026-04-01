import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const submissionStatusEnum = pgEnum("submission_status", ["pending", "running", "completed", "failed"]);
export const logStatusEnum = pgEnum("log_status", ["pending", "running", "success", "failed"]);

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Sessions ─────────────────────────────────────────────────────────────────
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: integer("userId").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

// ─── Templates d'annonces ─────────────────────────────────────────────────────
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  title: text("title"),
  description: text("description"),
  price: varchar("price", { length: 64 }),
  category: varchar("category", { length: 128 }),
  contactName: varchar("contactName", { length: 255 }),
  contactPhone: varchar("contactPhone", { length: 32 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  location: varchar("location", { length: 255 }),
  imageUrls: json("imageUrls").$type<string[]>(),
  variables: json("variables").$type<Record<string, string>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

// ─── Annonces ─────────────────────────────────────────────────────────────────
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  templateId: integer("templateId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: varchar("price", { length: 64 }),
  category: varchar("category", { length: 128 }),
  contactName: varchar("contactName", { length: 255 }),
  contactPhone: varchar("contactPhone", { length: 32 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  location: varchar("location", { length: 255 }),
  imageUrls: json("imageUrls").$type<string[]>(),
  variables: json("variables").$type<Record<string, string>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

// ─── Soumissions multi-sites ──────────────────────────────────────────────────
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  announcementId: integer("announcementId").notNull(),
  targetSites: json("targetSites").$type<string[]>().notNull(),
  overallStatus: submissionStatusEnum("overallStatus").default("pending").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;

// ─── Logs de soumission par site ──────────────────────────────────────────────
export const submissionLogs = pgTable("submission_logs", {
  id: serial("id").primaryKey(),
  submissionId: integer("submissionId").notNull(),
  site: varchar("site", { length: 64 }).notNull(),
  status: logStatusEnum("status").default("pending").notNull(),
  externalUrl: text("externalUrl"),
  errorMessage: text("errorMessage"),
  logs: json("logs").$type<string[]>(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubmissionLog = typeof submissionLogs.$inferSelect;
export type InsertSubmissionLog = typeof submissionLogs.$inferInsert;

// ─── Configuration API (Capmonster, 5sim, etc.) ───────────────────────────────
export const apiConfig = pgTable("api_config", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  value: text("value"),
  description: text("description"),
  isSecret: boolean("isSecret").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ApiConfig = typeof apiConfig.$inferSelect;
export type InsertApiConfig = typeof apiConfig.$inferInsert;
