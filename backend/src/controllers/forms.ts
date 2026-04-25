import type { Request, Response } from 'express'
import { z } from 'zod'
import type { AuthRequest } from '../middleware/auth'
import prisma from '../utils/prisma'

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(z.any()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
})

export async function getForms(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const forms = await prisma.form.findMany({
    where: { userId },
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
