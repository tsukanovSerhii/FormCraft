import { Router } from 'express'
import { getResponses, submitResponse } from '../controllers/responses'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.post('/:formId/submit', submitResponse)
router.get('/:formId', requireAuth, getResponses)

export default router
