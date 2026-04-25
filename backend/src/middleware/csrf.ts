import type { Request, Response, NextFunction } from 'express'

const ALLOWED_ORIGINS = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())

export function csrfProtect(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin ?? req.headers.referer ?? ''
  const allowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o))
  if (!allowed) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }
  next()
}
