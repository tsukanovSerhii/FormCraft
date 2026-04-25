import { Router } from 'express'
import { getPublicForm, getSitemap } from '../controllers/public'

const router = Router()

router.get('/forms/:id', getPublicForm)
router.get('/sitemap.xml', getSitemap)

export default router
