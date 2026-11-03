import type { Request, Response } from 'express'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { AuthRequest } from '../middleware/auth'
import prisma from '../utils/prisma'
import { canWriteToWorkspace, findAccessibleForm } from '../utils/formAccess'

const formSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  // Field shape is owned by the builder; enforce the essentials and a sane size
  fields: z.array(z.object({
    id: z.string().min(1).max(100),
    type: z.enum(['text', 'textarea', 'number', 'email', 'phone', 'select', 'checkbox', 'radio', 'date', 'file', 'rating']),
    label: z.string().max(500),
  }).passthrough()).max(200).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  expiresAt: z.string().datetime().optional().nullable(),
  maxResponses: z.number().int().positive().optional().nullable(),
  workspaceId: z.string().optional().nullable(),
})

export async function getForms(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const { workspaceId } = req.query

  // If workspaceId given, verify membership then return workspace forms
  if (workspaceId && typeof workspaceId === 'string') {
    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    })
    if (!member?.acceptedAt) {
      res.status(403).json({ error: 'Not a member of this workspace' })
      return
    }
    const forms = await prisma.form.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: 'desc' },
    })
    res.json(forms)
    return
  }

  const forms = await prisma.form.findMany({
    where: { userId, workspaceId: null },
    orderBy: { updatedAt: 'desc' },
  })
  res.json(forms)
}

export async function getForm(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const form = await findAccessibleForm(req.params.id, userId)
  if (!form) {
    res.status(404).json({ error: 'Form not found' })
    return
  }
  res.json(form)
}

export async function createForm(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const parsed = formSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }
  if (parsed.data.workspaceId && !(await canWriteToWorkspace(parsed.data.workspaceId, userId))) {
    res.status(403).json({ error: 'Not allowed to add forms to this workspace' })
    return
  }

  const form = await prisma.form.create({
    data: { ...parsed.data, fields: parsed.data.fields as Prisma.InputJsonValue, userId },
  })
  res.status(201).json(form)
}

export async function updateForm(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const parsed = formSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const existing = await findAccessibleForm(req.params.id, userId, 'write')
  if (!existing) {
    res.status(404).json({ error: 'Form not found' })
    return
  }
  if (parsed.data.workspaceId && parsed.data.workspaceId !== existing.workspaceId
    && !(await canWriteToWorkspace(parsed.data.workspaceId, userId))) {
    res.status(403).json({ error: 'Not allowed to move the form to this workspace' })
    return
  }

  // Snapshot current state when publishing
  if (parsed.data.status === 'published' && existing.status !== 'published') {
    const count = await prisma.formVersion.count({ where: { formId: existing.id } })
    await prisma.formVersion.create({
      data: { formId: existing.id, version: count + 1, title: existing.title, fields: existing.fields as Prisma.InputJsonValue },
    })
  }

  const form = await prisma.form.update({
    where: { id: req.params.id },
    data: { ...parsed.data, fields: parsed.data.fields as Prisma.InputJsonValue | undefined },
  })
  res.json(form)
}

export async function deleteForm(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const existing = await findAccessibleForm(req.params.id, userId, 'delete')
  if (!existing) {
    res.status(404).json({ error: 'Form not found' })
    return
  }

  await prisma.form.delete({ where: { id: req.params.id } })
  res.json({ ok: true })
}
