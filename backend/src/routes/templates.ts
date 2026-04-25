import { Router } from 'express'
import { createTemplate, deleteTemplate, getTemplates } from '../controllers/templates'
import { requireAuth } from '../middleware/auth'
import { csrfProtect } from '../middleware/csrf'

const router = Router()

router.use(requireAuth)
router.get('/', getTemplates)
router.post('/', csrfProtect, createTemplate)
router.delete('/:id', csrfProtect, deleteTemplate)

export default router
