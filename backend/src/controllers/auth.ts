import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express'
import { z } from 'zod'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'
import prisma from '../utils/prisma'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const { email, password, name } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409).json({ error: 'Email already in use' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({ data: { email, name, passwordHash } })

  const accessToken = signAccessToken(user.id)
  const refreshToken = signRefreshToken(user.id)
  setRefreshCookie(res, refreshToken)

  res.status(201).json({ accessToken, user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl } })
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const accessToken = signAccessToken(user.id)
  const refreshToken = signRefreshToken(user.id)
  setRefreshCookie(res, refreshToken)

  res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl } })
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refresh_token
  if (!token) {
    res.status(401).json({ error: 'No refresh token' })
    return
  }

  try {
    const payload = verifyRefreshToken(token)
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) {
      res.status(401).json({ error: 'User not found' })
      return
    }

    const accessToken = signAccessToken(user.id)
    const newRefresh = signRefreshToken(user.id)
    setRefreshCookie(res, newRefresh)

    res.json({ accessToken })
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('refresh_token')
  res.json({ ok: true })
}

export async function me(req: Request, res: Response) {
  const userId = (req as any).userId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, avatarUrl: true },
  })
  if (!user) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.json(user)
}

export async function updateProfile(req: Request, res: Response) {
  const userId = (req as any).userId
  const { name } = req.body
  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'Name is required' })
    return
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name: name.trim() },
    select: { id: true, email: true, name: true, avatarUrl: true },
  })
  res.json(user)
}

export async function changePassword(req: Request, res: Response) {
  const userId = (req as any).userId
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    res.status(400).json({ error: 'Invalid request' })
    return
  }
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.passwordHash) {
    res.status(400).json({ error: 'Account uses OAuth login, no password set' })
    return
  }
  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    res.status(401).json({ error: 'Current password is incorrect' })
    return
  }
  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } })
  res.json({ ok: true })
}

export async function deleteAccount(req: Request, res: Response) {
  const userId = (req as any).userId
  await prisma.user.delete({ where: { id: userId } })
  res.clearCookie('refresh_token')
  res.json({ ok: true })
}

export function oauthCallback(req: Request, res: Response) {
  const user = req.user as any
  const accessToken = signAccessToken(user.id)
  const refreshToken = signRefreshToken(user.id)

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173'
  res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`)
}
