import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import passport from 'passport'
import authRoutes from './routes/auth'
import formRoutes from './routes/forms'
import responseRoutes from './routes/responses'
import './services/passport'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/forms', formRoutes)
app.use('/api/responses', responseRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
