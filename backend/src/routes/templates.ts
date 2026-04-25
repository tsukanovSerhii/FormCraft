import { Router } from 'express'
import { createTemplate, deleteTemplate, getTemplates } from '../controllers/templates'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.use(requireAuth)
router.get('/', getTemplates)
router.post('/', createTemplate)
router.delete('/:id', deleteTemplate)

export default router
