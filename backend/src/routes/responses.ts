import { Router } from 'express'
import { exportCSV, getResponses, submitResponse } from '../controllers/responses'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.post('/:formId/submit', submitResponse)
router.get('/:formId', requireAuth, getResponses)
router.get('/:formId/export/csv', requireAuth, exportCSV)

export default router
