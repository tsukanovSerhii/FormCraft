import type { Request, Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import prisma from '../utils/prisma'

export async function getTemplates(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const templates = await prisma.userTemplate.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  res.json(templates)
}

export async function createTemplate(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const { title, description, category, fields } = req.body

  if (!title?.trim()) {
    res.status(400).json({ error: 'Title is required' })
    return
  }

  const template = await prisma.userTemplate.create({
    data: {
      title: title.trim(),
      description: description?.trim() ?? null,
      category: category?.trim() || 'Custom',
      fields: fields ?? [],
      userId,
    },
  })
  res.status(201).json(template)
}

export async function deleteTemplate(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const existing = await prisma.userTemplate.findFirst({
    where: { id: req.params.id, userId },
  })
  if (!existing) {
    res.status(404).json({ error: 'Template not found' })
    return
  }
  await prisma.userTemplate.delete({ where: { id: req.params.id } })
  res.json({ ok: true })
}
