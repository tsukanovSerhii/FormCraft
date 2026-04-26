import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import {
  sseStream,
  listNotifications,
  markRead,
  markAllRead,
  getPreferences,
  updatePreferences,
} from '../controllers/notifications'

const router = Router()

router.get('/stream',        requireAuth, sseStream)
router.get('/preferences',   requireAuth, getPreferences)
router.patch('/preferences', requireAuth, updatePreferences)
router.get('/',              requireAuth, listNotifications)
router.patch('/read-all',    requireAuth, markAllRead)
router.patch('/:id/read',    requireAuth, markRead)

export default router
