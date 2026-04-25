import { Router } from 'express'
import { createForm, deleteForm, getForm, getForms, updateForm } from '../controllers/forms'
import { requireAuth } from '../middleware/auth'
import { csrfProtect } from '../middleware/csrf'

const router = Router()

router.use(requireAuth)

router.get('/', getForms)
router.get('/:id', getForm)
router.post('/', csrfProtect, createForm)
router.patch('/:id', csrfProtect, updateForm)
router.delete('/:id', csrfProtect, deleteForm)

export default router
