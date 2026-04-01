import postgres from "postgres";

const sql = postgres("postgresql://admin:123654789@72.62.190.75:5432/db", {
  ssl: false,
  max: 1,
  connect_timeout: 10,
});

console.log("Connecting to PostgreSQL...");

try {
  // Create enums
  await sql`DO $$ BEGIN CREATE TYPE "role" AS ENUM ('user', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
  console.log("✓ Enum 'role' created");

  await sql`DO $$ BEGIN CREATE TYPE "submission_status" AS ENUM ('pending', 'running', 'completed', 'failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
  console.log("✓ Enum 'submission_status' created");

  await sql`DO $$ BEGIN CREATE TYPE "log_status" AS ENUM ('pending', 'running', 'success', 'failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
  console.log("✓ Enum 'log_status' created");

  // Create tables
  await sql`CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(320) NOT NULL UNIQUE,
    "name" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "lastSignedIn" TIMESTAMP NOT NULL DEFAULT NOW()
  )`;
  console.log("✓ Table 'users' created");

  await sql`CREATE TABLE IF NOT EXISTS "sessions" (
    "id" VARCHAR(128) PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
  )`;
  console.log("✓ Table 'sessions' created");

  await sql`CREATE TABLE IF NOT EXISTS "templates" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "price" VARCHAR(64),
    "category" VARCHAR(128),
    "contactName" VARCHAR(255),
    "contactPhone" VARCHAR(32),
    "contactEmail" VARCHAR(320),
    "location" VARCHAR(255),
    "imageUrls" JSON,
    "variables" JSON,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
  )`;
  console.log("✓ Table 'templates' created");

  await sql`CREATE TABLE IF NOT EXISTS "announcements" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "templateId" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" VARCHAR(64),
    "category" VARCHAR(128),
    "contactName" VARCHAR(255),
    "contactPhone" VARCHAR(32),
    "contactEmail" VARCHAR(320),
    "location" VARCHAR(255),
    "imageUrls" JSON,
    "variables" JSON,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
  )`;
  console.log("✓ Table 'announcements' created");

  await sql`CREATE TABLE IF NOT EXISTS "submissions" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "announcementId" INTEGER NOT NULL,
    "targetSites" JSON NOT NULL,
    "overallStatus" "submission_status" NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP,
    "completedAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
  )`;
  console.log("✓ Table 'submissions' created");

  await sql`CREATE TABLE IF NOT EXISTS "submission_logs" (
    "id" SERIAL PRIMARY KEY,
    "submissionId" INTEGER NOT NULL,
    "site" VARCHAR(64) NOT NULL,
    "status" "log_status" NOT NULL DEFAULT 'pending',
    "externalUrl" TEXT,
    "errorMessage" TEXT,
    "logs" JSON,
    "startedAt" TIMESTAMP,
    "completedAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
  )`;
  console.log("✓ Table 'submission_logs' created");

  await sql`CREATE TABLE IF NOT EXISTS "api_config" (
    "id" SERIAL PRIMARY KEY,
    "key" VARCHAR(128) NOT NULL UNIQUE,
    "value" TEXT,
    "description" TEXT,
    "isSecret" BOOLEAN NOT NULL DEFAULT TRUE,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
  )`;
  console.log("✓ Table 'api_config' created");

  console.log("\n✅ All tables created successfully!");

  // Verify
  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
  console.log("Tables in DB:", tables.map(t => t.tablename).join(", "));

} catch (e) {
  console.error("❌ Error:", e.message);
} finally {
  await sql.end();
}
