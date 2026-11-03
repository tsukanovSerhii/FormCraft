import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import app from '../app'
import prisma from '../utils/prisma'
import { signAccessToken } from '../utils/jwt'

const db = prisma as any

// ── helpers ──────────────────────────────────────────────────────────────────

function makeUser(overrides = {}) {
  return {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: null,
    passwordHash: 'hashed_password',
    ...overrides,
  }
}

function authHeader(userId = 'user-1') {
  return { Authorization: `Bearer ${signAccessToken(userId)}` }
}

// ── Health ────────────────────────────────────────────────────────────────────

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})

// ── Auth: register ────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.user.findUnique.mockResolvedValue(null)
    db.user.create.mockResolvedValue(makeUser())
  })

  it('registers successfully with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123', name: 'Test User' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body.user.email).toBe('test@example.com')
  })

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'password123', name: 'Test' })
    expect(res.status).toBe(400)
  })

  it('returns 400 for password shorter than 8 chars', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'short', name: 'Test' })
    expect(res.status).toBe(400)
  })

  it('returns 409 when email already in use', async () => {
    db.user.findUnique.mockResolvedValue(makeUser())
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123', name: 'Test User' })
    expect(res.status).toBe(409)
    expect(res.body.error).toBe('Email already in use')
  })
})

// ── Auth: login ───────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.user.findUnique.mockResolvedValue(makeUser())
  })

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
  })

  it('returns 401 with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' })
    expect(res.status).toBe(401)
  })

  it('returns 401 for unknown email', async () => {
    db.user.findUnique.mockResolvedValue(null)
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' })
    expect(res.status).toBe(401)
  })
})

// ── Auth: me ──────────────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.user.findUnique.mockResolvedValue(makeUser())
  })

  it('returns user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set(authHeader())
    expect(res.status).toBe(200)
    expect(res.body.email).toBe('test@example.com')
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})

// ── Forms ─────────────────────────────────────────────────────────────────────

describe('GET /api/forms', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.form.findMany.mockResolvedValue([])
  })

  it('returns empty list when user has no forms', async () => {
    const res = await request(app).get('/api/forms').set(authHeader())
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/forms')
    expect(res.status).toBe(401)
  })

  it('answers 500 instead of crashing when the database fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    db.form.findMany.mockRejectedValue(new Error('connection terminated'))
    const res = await request(app).get('/api/forms').set(authHeader())
    expect(res.status).toBe(500)
    expect(res.body).toEqual({ error: 'Internal server error' })
  })
})

describe('POST /api/forms', () => {
  const newForm = {
    id: 'form-1',
    title: 'My Form',
    description: null,
    fields: [],
    status: 'draft',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    db.form.create.mockResolvedValue(newForm)
  })

  it('creates a form and returns 201', async () => {
    const res = await request(app)
      .post('/api/forms')
      .set(authHeader())
      .set('Origin', 'http://localhost:5173')
      .send({ title: 'My Form' })
    expect(res.status).toBe(201)
    expect(res.body.title).toBe('My Form')
  })

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/forms')
      .set(authHeader())
      .set('Origin', 'http://localhost:5173')
      .send({})
    expect(res.status).toBe(400)
  })

  it('returns 403 without Origin header (CSRF)', async () => {
    const res = await request(app)
      .post('/api/forms')
      .set(authHeader())
      .send({ title: 'My Form' })
    expect(res.status).toBe(403)
  })
})

describe('DELETE /api/forms/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.form.findUnique.mockResolvedValue({ id: 'form-1', userId: 'user-1', workspaceId: null })
    db.form.delete.mockResolvedValue({})
  })

  it('deletes an owned form', async () => {
    const res = await request(app)
      .delete('/api/forms/form-1')
      .set(authHeader())
      .set('Origin', 'http://localhost:5173')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  it('returns 404 when form not found', async () => {
    db.form.findUnique.mockResolvedValue(null)
    const res = await request(app)
      .delete('/api/forms/nonexistent')
      .set(authHeader())
      .set('Origin', 'http://localhost:5173')
    expect(res.status).toBe(404)
  })
})

// ── Public form ───────────────────────────────────────────────────────────────

describe('GET /api/public/forms/:id', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns a published form', async () => {
    db.form.findUnique.mockResolvedValue({ id: 'form-1', status: 'published', title: 'Survey' })
    const res = await request(app).get('/api/public/forms/form-1')
    expect(res.status).toBe(200)
    expect(res.body.title).toBe('Survey')
  })

  it('returns 404 for draft form', async () => {
    db.form.findUnique.mockResolvedValue({ id: 'form-1', status: 'draft' })
    const res = await request(app).get('/api/public/forms/form-1')
    expect(res.status).toBe(404)
  })

  it('returns 404 when form does not exist', async () => {
    db.form.findUnique.mockResolvedValue(null)
    const res = await request(app).get('/api/public/forms/missing')
    expect(res.status).toBe(404)
  })
})

// ── Responses: submit ─────────────────────────────────────────────────────────

describe('POST /api/responses/:formId/submit', () => {
  const publishedForm = { id: 'form-1', status: 'published', fields: [] }
  const createdResponse = { id: 'resp-1', formId: 'form-1', data: {}, submittedAt: new Date() }

  beforeEach(() => {
    vi.clearAllMocks()
    db.form.findUnique.mockResolvedValue(publishedForm)
    db.response.create.mockResolvedValue(createdResponse)
  })

  it('submits a response to a published form', async () => {
    const res = await request(app)
      .post('/api/responses/form-1/submit')
      .send({ name: 'Alice' })
    expect(res.status).toBe(201)
    expect(res.body.id).toBe('resp-1')
  })

  it('returns 404 for a draft form', async () => {
    db.form.findUnique.mockResolvedValue({ id: 'form-1', status: 'draft', fields: [] })
    const res = await request(app)
      .post('/api/responses/form-1/submit')
      .send({ name: 'Alice' })
    expect(res.status).toBe(404)
  })

  it('returns 404 when form does not exist', async () => {
    db.form.findUnique.mockResolvedValue(null)
    const res = await request(app)
      .post('/api/responses/missing/submit')
      .send({})
    expect(res.status).toBe(404)
  })
})

// ── Responses: get paginated ──────────────────────────────────────────────────

describe('GET /api/responses/:formId', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.form.findUnique.mockResolvedValue({ id: 'form-1', userId: 'user-1', workspaceId: null })
    db.response.findMany.mockResolvedValue([])
    db.response.count.mockResolvedValue(0)
  })

  it('returns paginated responses for owned form', async () => {
    const res = await request(app)
      .get('/api/responses/form-1')
      .set(authHeader())
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ responses: [], total: 0, page: 1 })
  })

  it('returns 404 for non-owned form', async () => {
    db.form.findUnique.mockResolvedValue(null)
    const res = await request(app)
      .get('/api/responses/form-1')
      .set(authHeader())
    expect(res.status).toBe(404)
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/responses/form-1')
    expect(res.status).toBe(401)
  })
})

// ── Submission validation ─────────────────────────────────────────────────────

describe('POST /api/responses/:formId/submit — validation', () => {
  const fields = [
    { id: 'name', type: 'text', label: 'Name', required: true },
    { id: 'email', type: 'email', label: 'Email', required: false },
    { id: 'role', type: 'select', label: 'Role', required: true },
    { id: 'company', type: 'text', label: 'Company', required: true,
      condition: { fieldId: 'role', operator: 'equals', value: 'Employee' } },
    { id: 'score', type: 'rating', label: 'Score', required: false, ratingMax: 5 },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    db.form.findUnique.mockResolvedValue({ id: 'form-1', userId: 'owner', status: 'published', fields })
    db.response.create.mockImplementation(({ data }: any) => Promise.resolve({ id: 'resp-1', ...data }))
    db.user.findUnique.mockResolvedValue(null)
  })

  const submit = (body: object) => request(app).post('/api/responses/form-1/submit').send(body)

  it('rejects a missing required field', async () => {
    const res = await submit({ role: 'Student' })
    expect(res.status).toBe(400)
    expect(res.body.error).toContain('Name')
    expect(db.response.create).not.toHaveBeenCalled()
  })

  it('skips required fields hidden by their condition', async () => {
    const res = await submit({ name: 'Ann', role: 'Student' })
    expect(res.status).toBe(201)
  })

  it('requires a conditional field once it is visible', async () => {
    const res = await submit({ name: 'Ann', role: 'Employee' })
    expect(res.status).toBe(400)
    expect(res.body.error).toContain('Company')
  })

  it('stores only answers to fields of the form', async () => {
    await submit({ name: 'Ann', role: 'Student', company: 'Hidden Co', injected: 'x'.repeat(50) })
    expect(db.response.create.mock.calls[0][0].data.data).toEqual({ name: 'Ann', role: 'Student' })
  })

  it('rejects an invalid email and an out-of-range rating', async () => {
    expect((await submit({ name: 'Ann', role: 'Student', email: 'nope' })).status).toBe(400)
    expect((await submit({ name: 'Ann', role: 'Student', score: 9 })).status).toBe(400)
  })
})

// ── Workspace access to forms ─────────────────────────────────────────────────

describe('workspace members and forms', () => {
  const teamForm = { id: 'form-1', userId: 'author', workspaceId: 'ws-1', status: 'draft', fields: [] }

  beforeEach(() => {
    vi.clearAllMocks()
    db.form.findUnique.mockResolvedValue(teamForm)
    db.response.findMany.mockResolvedValue([])
    db.response.count.mockResolvedValue(0)
  })

  it('lets a viewer read responses of a team form', async () => {
    db.workspaceMember.findUnique.mockResolvedValue({ role: 'viewer', acceptedAt: new Date() })
    const res = await request(app).get('/api/responses/form-1').set(authHeader())
    expect(res.status).toBe(200)
  })

  it('does not let a viewer delete a team form', async () => {
    db.workspaceMember.findUnique.mockResolvedValue({ role: 'viewer', acceptedAt: new Date() })
    const res = await request(app).delete('/api/forms/form-1').set(authHeader()).set('Origin', 'http://localhost:5173')
    expect(res.status).toBe(404)
    expect(db.form.delete).not.toHaveBeenCalled()
  })

  it('hides team forms from users who have not accepted the invitation', async () => {
    db.workspaceMember.findUnique.mockResolvedValue({ role: 'editor', acceptedAt: null })
    const res = await request(app).get('/api/responses/form-1').set(authHeader())
    expect(res.status).toBe(404)
  })

  it('refuses to create a form in a workspace the user does not belong to', async () => {
    db.workspaceMember.findUnique.mockResolvedValue(null)
    const res = await request(app).post('/api/forms').set(authHeader()).set('Origin', 'http://localhost:5173')
      .send({ title: 'Sneaky', workspaceId: 'someone-elses' })
    expect(res.status).toBe(403)
    expect(db.form.create).not.toHaveBeenCalled()
  })
})
