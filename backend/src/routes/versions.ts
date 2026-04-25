import { Router } from 'express'
import { getVersions, restoreVersion } from '../controllers/versions'
import { requireAuth } from '../middleware/auth'
import { csrfProtect } from '../middleware/csrf'

const router = Router({ mergeParams: true })

router.use(requireAuth)
router.get('/', getVersions)
router.post('/:versionId/restore', csrfProtect, restoreVersion)

export default router
