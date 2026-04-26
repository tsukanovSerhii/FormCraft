-- Phase 15: Notifications + real-time

-- Add notifyOnResponse to users
ALTER TABLE "users" ADD COLUMN "notifyOnResponse" BOOLEAN NOT NULL DEFAULT true;

-- Create notifications table
CREATE TABLE "notifications" (
  "id"        TEXT NOT NULL,
  "type"      TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "body"      TEXT NOT NULL,
  "read"      BOOLEAN NOT NULL DEFAULT false,
  "meta"      JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId"    TEXT NOT NULL,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "notifications"
  ADD CONSTRAINT "notifications_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
