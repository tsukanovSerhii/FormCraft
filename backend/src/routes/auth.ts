import { Router, type RequestHandler } from 'express'
import passport from 'passport'
import { changePassword, deleteAccount, login, logout, me, oauthCallback, refresh, register, updateProfile } from '../controllers/auth'
import { requireAuth } from '../middleware/auth'
import { oauthEnabled } from '../services/passport'

const router = Router()

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'

// Without credentials the strategy isn't registered — send the user back to login instead of a 500
function requireProvider(provider: keyof typeof oauthEnabled): RequestHandler {
  return (_req, res, next) => {
    if (oauthEnabled[provider]) return next()
    res.redirect(`${FRONTEND_URL}/login?error=oauth_unavailable`)
  }
}

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', requireAuth, me)
router.patch('/me', requireAuth, updateProfile)
router.patch('/me/password', requireAuth, changePassword)
router.delete('/me', requireAuth, deleteAccount)

router.get('/google', requireProvider('google'), passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get('/google/callback', requireProvider('google'), passport.authenticate('google', { session: false, failureRedirect: '/login' }), oauthCallback)

router.get('/github', requireProvider('github'), passport.authenticate('github', { scope: ['user:email'], session: false }))
router.get('/github/callback', requireProvider('github'), passport.authenticate('github', { session: false, failureRedirect: '/login' }), oauthCallback)

export default router
