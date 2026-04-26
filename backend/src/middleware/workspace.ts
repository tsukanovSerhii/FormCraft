import type { NextFunction, Request, Response } from 'express'
import type { AuthRequest } from './auth'
import prisma from '../utils/prisma'

export type WorkspaceRole = 'owner' | 'editor' | 'viewer'

export interface WorkspaceRequest extends Request {
  workspaceMember: { role: WorkspaceRole }
}

// Attach the caller's membership to req; reject if not a member
async function loadMember(req: Request, res: Response, next: NextFunction) {
  const userId = (req as AuthRequest).userId
  const workspaceId = req.params.id

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  })

  if (!member || !member.acceptedAt) {
    res.status(403).json({ error: 'Not a member of this workspace' })
    return
  }

  ;(req as unknown as WorkspaceRequest).workspaceMember = { role: member.role as WorkspaceRole }
  next()
}

function requireRole(...allowed: WorkspaceRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as unknown as WorkspaceRequest).workspaceMember?.role
    if (!role || !allowed.includes(role)) {
      res.status(403).json({ error: 'Insufficient permissions' })
      return
    }
    next()
  }
}

export const workspaceAuth = {
  member: [loadMember],
  owner:  [loadMember, requireRole('owner')],
  editor: [loadMember, requireRole('owner', 'editor')],
}
