import { Router } from 'express'
import { createForm, deleteForm, getForm, getForms, updateForm } from '../controllers/forms'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

router.get('/', getForms)
router.get('/:id', getForm)
router.post('/', createForm)
router.patch('/:id', updateForm)
router.delete('/:id', deleteForm)

export default router
