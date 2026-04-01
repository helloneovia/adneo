-- ADNEO — Migration initiale PostgreSQL
-- À exécuter une seule fois sur la base adneo-db-dfqrpm

-- Enums
CREATE TYPE IF NOT EXISTS "role" AS ENUM ('user', 'admin');
CREATE TYPE IF NOT EXISTS "submission_status" AS ENUM ('pending', 'running', 'completed', 'failed');
CREATE TYPE IF NOT EXISTS "log_status" AS ENUM ('pending', 'running', 'success', 'failed');

-- Users
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(320) NOT NULL UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  "role" "role" NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastSignedIn" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS "sessions" (
  "id" VARCHAR(128) PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Templates
CREATE TABLE IF NOT EXISTS "templates" (
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
);

-- Announcements
CREATE TABLE IF NOT EXISTS "announcements" (
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
);

-- Submissions
CREATE TABLE IF NOT EXISTS "submissions" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "announcementId" INTEGER NOT NULL,
  "targetSites" JSON NOT NULL,
  "overallStatus" "submission_status" NOT NULL DEFAULT 'pending',
  "startedAt" TIMESTAMP,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Submission logs
CREATE TABLE IF NOT EXISTS "submission_logs" (
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
);

-- API Config
CREATE TABLE IF NOT EXISTS "api_config" (
  "id" SERIAL PRIMARY KEY,
  "key" VARCHAR(128) NOT NULL UNIQUE,
  "value" TEXT,
  "description" TEXT,
  "isSecret" BOOLEAN NOT NULL DEFAULT TRUE,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
