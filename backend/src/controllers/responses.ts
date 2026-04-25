import type { Request, Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import prisma from '../utils/prisma'

export async function submitResponse(req: Request, res: Response) {
  const { formId } = req.params
  const userId = (req as any).userId as string | undefined

  const form = await prisma.form.findUnique({ where: { id: formId } })
  if (!form || form.status !== 'published') {
    res.status(404).json({ error: 'Form not found or not published' })
    return
  }

  const response = await prisma.response.create({
    data: { formId, userId: userId ?? null, data: req.body },
  })
  res.status(201).json(response)
}

export async function getResponses(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId

  const form = await prisma.form.findFirst({ where: { id: req.params.formId, userId } })
  if (!form) {
    res.status(404).json({ error: 'Form not found' })
    return
  }

  const responses = await prisma.response.findMany({
    where: { formId: req.params.formId },
    orderBy: { submittedAt: 'desc' },
  })
  res.json(responses)
}
