import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { exportCSV, getResponses, submitResponse } from '../controllers/responses'
import { requireAuth } from '../middleware/auth'

const router = Router()

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions, please try again later.' },
})

router.post('/:formId/submit', submitLimiter, submitResponse)
router.get('/:formId', requireAuth, getResponses)
router.get('/:formId/export/csv', requireAuth, exportCSV)

export default router
