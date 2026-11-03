import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken, verifyRefreshToken } from '../utils/jwt'

export interface AuthRequest extends Request {
  userId: string
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const token = header.slice(7)
    const payload = verifyAccessToken(token)
    ;(req as AuthRequest).userId = payload.sub
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// For EventSource streams: the browser can't attach an Authorization header there,
// but it does send the httpOnly refresh cookie, so the user is taken from it
export function requireAuthFromCookie(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.refresh_token
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    ;(req as AuthRequest).userId = verifyRefreshToken(token).sub
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
