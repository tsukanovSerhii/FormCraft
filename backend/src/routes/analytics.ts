import { Router } from 'express'
import { getFormAnalytics } from '../controllers/analytics'
import { requireAuth } from '../middleware/auth'

const router = Router({ mergeParams: true })

router.get('/:formId/analytics', requireAuth, getFormAnalytics)

export default router
