import type { Request, Response } from 'express'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { AuthRequest } from '../middleware/auth'
import prisma from '../utils/prisma'

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(z.any()).default([]),
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
    if (!member) {
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
  const form = await prisma.form.findFirst({
    where: { id: req.params.id, userId },
  })
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

  const form = await prisma.form.create({
    data: { ...parsed.data, userId },
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

  const existing = await prisma.form.findFirst({ where: { id: req.params.id, userId } })
  if (!existing) {
    res.status(404).json({ error: 'Form not found' })
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
    data: parsed.data,
  })
  res.json(form)
}

export async function deleteForm(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const existing = await prisma.form.findFirst({ where: { id: req.params.id, userId } })
  if (!existing) {
    res.status(404).json({ error: 'Form not found' })
    return
  }

  await prisma.form.delete({ where: { id: req.params.id } })
  res.json({ ok: true })
}
