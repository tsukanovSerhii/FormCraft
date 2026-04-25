import { Router } from 'express'
import { getPublicForm } from '../controllers/public'

const router = Router()

router.get('/forms/:id', getPublicForm)

export default router
