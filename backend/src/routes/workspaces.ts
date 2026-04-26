import { Router } from 'express'
import {
  createWorkspace,
  deleteWorkspace,
  getMembers,
  getWorkspaces,
  inviteMember,
  removeMember,
  updateMemberRole,
  updateWorkspace,
} from '../controllers/workspaces'
import { requireAuth } from '../middleware/auth'
import { csrfProtect } from '../middleware/csrf'
import { workspaceAuth } from '../middleware/workspace'

const router = Router()

router.use(requireAuth)

// Workspace CRUD
router.get('/', getWorkspaces)
router.post('/', csrfProtect, createWorkspace)
router.patch('/:id', csrfProtect, ...workspaceAuth.owner, updateWorkspace)
router.delete('/:id', csrfProtect, ...workspaceAuth.owner, deleteWorkspace)

// Members
router.get('/:id/members', ...workspaceAuth.member, getMembers)
router.post('/:id/invite', csrfProtect, ...workspaceAuth.owner, inviteMember)
router.patch('/:id/members/:userId', csrfProtect, ...workspaceAuth.owner, updateMemberRole)
router.delete('/:id/members/:userId', csrfProtect, ...workspaceAuth.member, removeMember)

export default router
