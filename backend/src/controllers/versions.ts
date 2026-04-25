import type { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import type { AuthRequest } from '../middleware/auth'
import prisma from '../utils/prisma'

export async function getVersions(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const form = await prisma.form.findFirst({ where: { id: req.params.formId, userId } })
  if (!form) { res.status(404).json({ error: 'Form not found' }); return }

  const versions = await prisma.formVersion.findMany({
    where: { formId: req.params.formId },
    orderBy: { version: 'desc' },
    select: { id: true, version: true, title: true, createdAt: true },
  })
  res.json(versions)
}

export async function restoreVersion(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const form = await prisma.form.findFirst({ where: { id: req.params.formId, userId } })
  if (!form) { res.status(404).json({ error: 'Form not found' }); return }

  const version = await prisma.formVersion.findFirst({
    where: { id: req.params.versionId, formId: req.params.formId },
  })
  if (!version) { res.status(404).json({ error: 'Version not found' }); return }

  // Save current state as a new version before restoring
  const count = await prisma.formVersion.count({ where: { formId: form.id } })
  await prisma.formVersion.create({
    data: { formId: form.id, version: count + 1, title: form.title, fields: form.fields as Prisma.InputJsonValue },
  })

  const updated = await prisma.form.update({
    where: { id: form.id },
    data: { title: version.title, fields: version.fields as Prisma.InputJsonValue },
  })
  res.json(updated)
}
