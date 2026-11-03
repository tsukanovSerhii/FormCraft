import './loadEnv'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// App traffic uses the pooled Neon URL (-pooler host); migrations use the direct one (prisma.config.ts)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default prisma
