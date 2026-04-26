-- Phase 14: Workspace & Team collaboration

CREATE TABLE "workspaces" (
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "slug"      TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

CREATE TABLE "workspace_members" (
    "id"          TEXT NOT NULL,
    "role"        TEXT NOT NULL DEFAULT 'editor',
    "workspaceId" TEXT NOT NULL,
    "userId"      TEXT NOT NULL,
    "invitedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt"  TIMESTAMP(3),
    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "workspace_members_workspaceId_userId_key" ON "workspace_members"("workspaceId", "userId");

ALTER TABLE "workspace_members"
    ADD CONSTRAINT "workspace_members_workspaceId_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "workspace_members"
    ADD CONSTRAINT "workspace_members_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add optional workspaceId to forms
ALTER TABLE "forms" ADD COLUMN "workspaceId" TEXT;

ALTER TABLE "forms"
    ADD CONSTRAINT "forms_workspaceId_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
