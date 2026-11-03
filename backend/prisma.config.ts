import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

// Same lookup as src/utils/loadEnv.ts: backend/.env, then repo-root .env (from `neon env pull`)
dotenv.config({ path: ['.env', '../.env'], quiet: true })

// Prisma Migrate needs a direct (non-pooled) connection — PgBouncer breaks prepared statements
// and session state. Falls back to DATABASE_URL for plain Postgres (docker-compose).
const migrationUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasource: {
    url: migrationUrl,
  },
  migrate: {
    adapter: () => new PrismaPg({ connectionString: migrationUrl }),
  },
})
