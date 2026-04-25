import { vi } from 'vitest'

// Set required env vars before any module is loaded
process.env.JWT_SECRET = 'test-secret-key'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key'
process.env.FRONTEND_URL = 'http://localhost:5173'

// Mock Prisma so tests don't need a real database
vi.mock('../utils/prisma', () => {
  const user = {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  }
  const form = {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  }
  const response = {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  }
  const userTemplate = {
    findMany: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
  }

  return {
    default: { user, form, response, userTemplate },
  }
})

// Mock passport strategies — no real OAuth in tests
vi.mock('../services/passport', () => ({}))

// Mock bcryptjs so hashing doesn't block tests (real bcrypt is too slow in unit tests)
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn().mockImplementation((plain: string, _hash: string) =>
      Promise.resolve(plain === 'password123')
    ),
    hashSync: (_plain: string, _rounds: number) => 'hashed_password',
  },
}))
