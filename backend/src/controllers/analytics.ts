import type { Request, Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import prisma from '../utils/prisma'

export async function getFormAnalytics(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId
  const { formId } = req.params
  const days = Math.min(365, parseInt(req.query.days as string) || 30)

  const form = await prisma.form.findFirst({ where: { id: formId, userId } })
  if (!form) {
    res.status(404).json({ error: 'Form not found' })
    return
  }

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const responses = await prisma.response.findMany({
    where: { formId, submittedAt: { gte: since } },
    select: { id: true, submittedAt: true, data: true },
    orderBy: { submittedAt: 'asc' },
  })

  // Responses per day
  const byDay: Record<string, number> = {}
  for (const r of responses) {
    const key = r.submittedAt.toISOString().slice(0, 10)
    byDay[key] = (byDay[key] ?? 0) + 1
  }

  // Responses by hour of day (0-23)
  const byHour: number[] = Array(24).fill(0)
  for (const r of responses) {
    byHour[r.submittedAt.getHours()]++
  }

  // Responses by day of week (0=Sun..6=Sat)
  const byDow: number[] = Array(7).fill(0)
  for (const r of responses) {
    byDow[r.submittedAt.getDay()]++
  }

  // Field-level distribution for radio/checkbox/select
  const fields = Array.isArray(form.fields)
    ? (form.fields as Array<{ id: string; type: string; label: string; options?: { id: string; label: string }[] }>)
    : []

  const fieldDistribution = fields
    .filter(f => ['radio', 'checkbox', 'select'].includes(f.type))
    .map(field => {
      const counts: Record<string, number> = {}
      for (const r of responses) {
        const data = r.data as Record<string, unknown>
        const val = data[field.id]
        if (!val) continue
        const values = Array.isArray(val) ? val : [val]
        for (const v of values) {
          const key = String(v)
          counts[key] = (counts[key] ?? 0) + 1
        }
      }
      return {
        fieldId: field.id,
        label: field.label,
        type: field.type,
        options: (field.options ?? []).map(o => ({
          label: o.label,
          count: counts[o.label] ?? 0,
        })),
      }
    })

  // Total all-time for completion rate
  const totalAllTime = await prisma.response.count({ where: { formId } })

  res.json({
    formId,
    formTitle: form.title,
    totalResponses: responses.length,
    totalAllTime,
    byDay,
    byHour,
    byDow,
    fieldDistribution,
  })
}
