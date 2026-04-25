import type { Request, Response } from 'express'
import prisma from '../utils/prisma'

export async function getPublicForm(req: Request, res: Response) {
  const form = await prisma.form.findUnique({ where: { id: req.params.id } })
  if (!form || form.status !== 'published') {
    res.status(404).json({ error: 'Form not found or not published' })
    return
  }
  res.json(form)
}
