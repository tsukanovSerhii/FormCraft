import dotenv from 'dotenv'
import path from 'path'

// Load backend/.env first, then the repo-root .env (written by `neon deploy` / `neon env pull`).
// Earlier files win; real environment variables (hosting dashboards) always take precedence.
const backendDir = path.resolve(__dirname, '../..')

dotenv.config({
  path: [path.join(backendDir, '.env'), path.join(backendDir, '..', '.env')],
  quiet: true,
})
