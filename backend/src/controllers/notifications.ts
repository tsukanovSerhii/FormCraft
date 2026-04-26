import type { Request, Response } from 'express'
import prisma from '../utils/prisma'

const sseClients = new Map<string, Set<Response>>()

export function addSseClient(userId: string, res: Response) {
  if (!sseClients.has(userId)) sseClients.set(userId, new Set())
  sseClients.get(userId)!.add(res)
}

export function removeSseClient(userId: string, res: Response) {
  sseClients.get(userId)?.delete(res)
}

export function pushToUser(userId: string, data: object) {
  const clients = sseClients.get(userId)
  if (!clients) return
  const payload = `data: ${JSON.stringify(data)}\n\n`
  for (const res of clients) {
    try { res.write(payload) } catch { clients.delete(res) }
  }
}

export async function sseStream(req: Request, res: Response) {
  const userId = (req as Request & { user?: { id: string } }).user?.id
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()

  res.write('event: ping\ndata: {}\n\n')

  addSseClient(userId, res)

  const keepalive = setInterval(() => {
    try { res.write('event: ping\ndata: {}\n\n') } catch { /* closed */ }
  }, 25000)

  req.on('close', () => {
    clearInterval(keepalive)
    removeSseClient(userId, res)
  })
}

export async function listNotifications(req: Request, res: Response) {
  const userId = (req as Request & { user?: { id: string } }).user?.id
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })

  res.json(notifications)
}

export async function markRead(req: Request, res: Response) {
  const userId = (req as Request & { user?: { id: string } }).user?.id
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const { id } = req.params
  const n = await prisma.notification.findFirst({ where: { id, userId } })
  if (!n) { res.status(404).json({ error: 'Not found' }); return }

  const updated = await prisma.notification.update({ where: { id }, data: { read: true } })
  res.json(updated)
}

export async function markAllRead(req: Request, res: Response) {
  const userId = (req as Request & { user?: { id: string } }).user?.id
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } })
  res.json({ ok: true })
}

export async function getPreferences(req: Request, res: Response) {
  const userId = (req as Request & { user?: { id: string } }).user?.id
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { notifyOnResponse: true } })
  res.json({ notifyOnResponse: user?.notifyOnResponse ?? true })
}

export async function updatePreferences(req: Request, res: Response) {
  const userId = (req as Request & { user?: { id: string } }).user?.id
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const { notifyOnResponse } = req.body as { notifyOnResponse?: boolean }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { notifyOnResponse: Boolean(notifyOnResponse) },
    select: { notifyOnResponse: true },
  })
  res.json(updated)
}
