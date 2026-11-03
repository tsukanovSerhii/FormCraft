// Server-side validation of a form submission. Mirrors frontend/src/schemas/fieldSchemas.ts:
// only answers to fields of the form are kept, fields hidden by their condition are skipped,
// required fields must be filled, values must match the field type.

interface FieldCondition {
  fieldId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_empty'
  value: string
}

interface FormField {
  id: string
  type: string
  label?: string
  required?: boolean
  ratingMax?: number
  condition?: FieldCondition
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s().-]{5,}$/
const MAX_TEXT_LENGTH = 10_000
const MAX_CHOICES = 100

function evaluateCondition(condition: FieldCondition | undefined, values: Record<string, unknown>): boolean {
  if (!condition) return true
  const raw = values[condition.fieldId]
  const val = Array.isArray(raw) ? raw.join(', ') : String(raw ?? '')
  switch (condition.operator) {
    case 'equals': return val === condition.value
    case 'not_equals': return val !== condition.value
    case 'contains': return val.toLowerCase().includes(String(condition.value).toLowerCase())
    case 'not_empty': return val.trim().length > 0
    default: return true
  }
}

function isEmpty(field: FormField, value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (field.type === 'rating') return Number(value) === 0
  return false
}

function checkValue(field: FormField, value: unknown): string | null {
  const name = field.label || field.id
  switch (field.type) {
    case 'email':
      return typeof value === 'string' && EMAIL_RE.test(value) ? null : `"${name}" must be a valid email address`
    case 'phone':
      return typeof value === 'string' && PHONE_RE.test(value) ? null : `"${name}" must be a valid phone number`
    case 'number':
      return Number.isFinite(Number(value)) && typeof value !== 'boolean' ? null : `"${name}" must be a number`
    case 'rating': {
      const n = Number(value)
      const max = field.ratingMax ?? 5
      return Number.isInteger(n) && n >= 1 && n <= max ? null : `"${name}" must be a rating from 1 to ${max}`
    }
    case 'checkbox':
      return Array.isArray(value) && value.length <= MAX_CHOICES && value.every(v => typeof v === 'string')
        ? null : `"${name}" must be a list of options`
    case 'file':
      return typeof value === 'object' && !Array.isArray(value) ? null : `"${name}" has an invalid file value`
    default:
      return typeof value === 'string' && value.length <= MAX_TEXT_LENGTH ? null : `"${name}" has an invalid value`
  }
}

export function validateSubmission(
  fields: FormField[],
  data: Record<string, unknown>,
): { data: Record<string, unknown> } | { error: string } {
  const clean: Record<string, unknown> = {}

  for (const field of fields) {
    if (!evaluateCondition(field.condition, data)) continue

    const value = data[field.id]
    if (isEmpty(field, value)) {
      if (field.required) return { error: `"${field.label || field.id}" is required` }
      continue
    }

    const error = checkValue(field, value)
    if (error) return { error }

    if (field.type === 'number' || field.type === 'rating') {
      clean[field.id] = Number(value)
    } else if (field.type === 'file') {
      // Files aren't uploaded (no storage) — keep only bounded metadata, never arbitrary objects
      const file = value as Record<string, unknown>
      clean[field.id] = { name: String(file.name ?? '').slice(0, 255), size: Number(file.size) || 0, type: String(file.type ?? '').slice(0, 100) }
    } else {
      clean[field.id] = value
    }
  }

  return { data: clean }
}
