import { Router } from 'express'
import passport from 'passport'
import { changePassword, deleteAccount, login, logout, me, oauthCallback, refresh, register, updateProfile } from '../controllers/auth'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', requireAuth, me)
router.patch('/me', requireAuth, updateProfile)
router.patch('/me/password', requireAuth, changePassword)
router.delete('/me', requireAuth, deleteAccount)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), oauthCallback)

router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }))
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }), oauthCallback)

export default router
