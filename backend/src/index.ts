import './utils/loadEnv'

import app from './app'

// Safety net for promises rejected outside the request cycle (e.g. fire-and-forget emails):
// log instead of letting Node terminate the whole server
process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err)
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
