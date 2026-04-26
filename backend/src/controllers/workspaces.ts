import type { Request, Response } from 'express'
import { z } from 'zod'
import type { AuthRequest } from '../middleware/auth'
import prisma from '../utils/prisma'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base
  let i = 2
  while (await prisma.workspace.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`
  }
  return slug
}

const createSchema = z.object({
  name: z.string().min(1).max(80),
})

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['editor', 'viewer']).default('editor'),
})

const updateRoleSchema = z.object({
  role: z.enum(['editor', 'viewer']),
})

// GET /api/workspaces — list workspaces the caller belongs to
export async function getWorkspaces(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId, acceptedAt: { not: null } },
    include: {
      workspace: {
        include: {
          _count: { select: { members: true, forms: true } },
        },
      },
    },
    orderBy: { workspace: { createdAt: 'asc' } },
  })
  res.json(memberships.map(m => ({ ...m.workspace, role: m.role })))
}

// POST /api/workspaces — create workspace, caller becomes owner
export async function createWorkspace(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const slug = await uniqueSlug(slugify(parsed.data.name))

  const workspace = await prisma.workspace.create({
    data: {
      name: parsed.data.name,
      slug,
      members: {
        create: { userId, role: 'owner', acceptedAt: new Date() },
      },
    },
  })
  res.status(201).json({ ...workspace, role: 'owner' })
}

// PATCH /api/workspaces/:id — rename (owner only, enforced by middleware)
export async function updateWorkspace(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const workspace = await prisma.workspace.update({
    where: { id: req.params.id },
    data: { name: parsed.data.name },
  })
  res.json(workspace)
}

// DELETE /api/workspaces/:id — delete workspace (owner only)
export async function deleteWorkspace(req: Request, res: Response) {
  await prisma.workspace.delete({ where: { id: req.params.id } })
  res.json({ ok: true })
}

// GET /api/workspaces/:id/members — list members
export async function getMembers(req: Request, res: Response) {
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: req.params.id },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    orderBy: { invitedAt: 'asc' },
  })
  res.json(members)
}

// POST /api/workspaces/:id/invite — invite user by email
export async function inviteMember(req: Request, res: Response) {
  const parsed = inviteSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (!user) {
    res.status(404).json({ error: 'No user with that email address found' })
    return
  }

  const existing = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: req.params.id, userId: user.id } },
  })
  if (existing) {
    res.status(409).json({ error: 'User is already a member of this workspace' })
    return
  }

  const member = await prisma.workspaceMember.create({
    data: {
      workspaceId: req.params.id,
      userId: user.id,
      role: parsed.data.role,
      // Auto-accept for simplicity (no email flow yet — Phase 15 adds notifications)
      acceptedAt: new Date(),
    },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
  })
  res.status(201).json(member)
}

// PATCH /api/workspaces/:id/members/:userId — change role (owner only)
export async function updateMemberRole(req: Request, res: Response) {
  const callerId = (req as AuthRequest).userId
  if (callerId === req.params.userId) {
    res.status(400).json({ error: 'Cannot change your own role' })
    return
  }

  const parsed = updateRoleSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: req.params.id, userId: req.params.userId } },
  })
  if (!member) {
    res.status(404).json({ error: 'Member not found' })
    return
  }

  const updated = await prisma.workspaceMember.update({
    where: { id: member.id },
    data: { role: parsed.data.role },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
  })
  res.json(updated)
}

// DELETE /api/workspaces/:id/members/:userId — remove member (owner) or leave (self)
export async function removeMember(req: Request, res: Response) {
  const callerId = (req as AuthRequest).userId

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: req.params.id, userId: req.params.userId } },
  })
  if (!member) {
    res.status(404).json({ error: 'Member not found' })
    return
  }
  if (member.role === 'owner') {
    res.status(400).json({ error: 'Cannot remove the workspace owner' })
    return
  }
  // Only owner or self can remove
  const callerMember = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: req.params.id, userId: callerId } },
  })
  if (callerId !== req.params.userId && callerMember?.role !== 'owner') {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  await prisma.workspaceMember.delete({ where: { id: member.id } })
  res.json({ ok: true })
}
