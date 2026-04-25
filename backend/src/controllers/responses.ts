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

  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20)
  const skip = (page - 1) * limit

  const [responses, total] = await Promise.all([
    prisma.response.findMany({
      where: { formId: req.params.formId },
      orderBy: { submittedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.response.count({ where: { formId: req.params.formId } }),
  ])

  res.json({ responses, total, page, limit, pages: Math.ceil(total / limit) })
}

export async function exportCSV(req: Request, res: Response) {
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

  if (responses.length === 0) {
    res.status(200).setHeader('Content-Type', 'text/csv').send('No responses yet')
    return
  }

  const allKeys = Array.from(
    new Set(responses.flatMap((r: { data: unknown }) => Object.keys(r.data as Record<string, unknown>)))
  )

  const escape = (v: unknown): string => {
    const s = Array.isArray(v) ? (v as unknown[]).join('; ') : String(v ?? '')
    return `"${s.replace(/"/g, '""')}"`
  }

  const header = ['id', 'submittedAt', ...allKeys].map(escape).join(',')
  const rows = responses.map((r: { id: string; submittedAt: Date; data: unknown }) => {
    const data = r.data as Record<string, unknown>
    return [r.id, r.submittedAt.toISOString(), ...allKeys.map(k => data[k as string] ?? '')].map(escape).join(',')
  })

  const csv = [header, ...rows].join('\n')
  const filename = `${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(csv)
}
