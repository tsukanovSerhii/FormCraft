import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import passport from 'passport'
import authRoutes from './routes/auth'
import formRoutes from './routes/forms'
import publicRoutes from './routes/public'
import responseRoutes from './routes/responses'
import templateRoutes from './routes/templates'
import versionRoutes from './routes/versions'
import workspaceRoutes from './routes/workspaces'
import notificationRoutes from './routes/notifications'
import './services/passport'

const app = express()

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/forms', formRoutes)
app.use('/api/forms/:formId/versions', versionRoutes)
app.use('/api/responses', responseRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/notifications', notificationRoutes)

app.get('/api/health', (_req, res) => { res.json({ status: 'ok' }) })

export default app
