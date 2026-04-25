import { describe, expect, it } from 'vitest'
import { buildValidationSchema } from '@/schemas/fieldSchemas'
import type { FormField } from '@/types/form'

function field(overrides: Partial<FormField> & { type: FormField['type'] }): FormField {
  return { id: 'f1', label: 'Test', required: false, ...overrides }
}

describe('buildValidationSchema', () => {
  // ── email ────────────────────────────────────────────────

  describe('email field', () => {
    it('accepts a valid email', () => {
      const schema = buildValidationSchema([field({ type: 'email', required: true })])
      expect(schema.safeParse({ f1: 'user@example.com' }).success).toBe(true)
    })

    it('rejects an invalid email', () => {
      const schema = buildValidationSchema([field({ type: 'email', required: true })])
      expect(schema.safeParse({ f1: 'not-an-email' }).success).toBe(false)
    })

    it('is optional when required is false', () => {
      const schema = buildValidationSchema([field({ type: 'email', required: false })])
      expect(schema.safeParse({ f1: undefined }).success).toBe(true)
    })
  })

  // ── number ───────────────────────────────────────────────

  describe('number field', () => {
    it('accepts a numeric string via coercion', () => {
      const schema = buildValidationSchema([field({ type: 'number', required: true })])
      expect(schema.safeParse({ f1: '42' }).success).toBe(true)
    })

    it('accepts a number value', () => {
      const schema = buildValidationSchema([field({ type: 'number', required: true })])
      expect(schema.safeParse({ f1: 0 }).success).toBe(true)
    })

    it('rejects non-numeric string', () => {
      const schema = buildValidationSchema([field({ type: 'number', required: true })])
      expect(schema.safeParse({ f1: 'abc' }).success).toBe(false)
    })
  })

  // ── phone ────────────────────────────────────────────────

  describe('phone field', () => {
    it('accepts a valid phone number', () => {
      const schema = buildValidationSchema([field({ type: 'phone', required: true })])
      expect(schema.safeParse({ f1: '+380501234567' }).success).toBe(true)
    })

    it('rejects a too-short phone number', () => {
      const schema = buildValidationSchema([field({ type: 'phone', required: true })])
      expect(schema.safeParse({ f1: '123' }).success).toBe(false)
    })
  })

  // ── text ─────────────────────────────────────────────────

  describe('text field', () => {
    it('accepts any non-empty string when required', () => {
      const schema = buildValidationSchema([field({ type: 'text', required: true })])
      expect(schema.safeParse({ f1: 'hello' }).success).toBe(true)
    })

    it('rejects empty string when required', () => {
      const schema = buildValidationSchema([field({ type: 'text', required: true })])
      expect(schema.safeParse({ f1: '' }).success).toBe(false)
    })

    it('is optional when required is false', () => {
      const schema = buildValidationSchema([field({ type: 'text', required: false })])
      expect(schema.safeParse({ f1: '' }).success).toBe(true)
    })
  })

  // ── radio / select ───────────────────────────────────────

  describe('radio field', () => {
    it('accepts a selected option string', () => {
      const schema = buildValidationSchema([field({ type: 'radio', required: true })])
      expect(schema.safeParse({ f1: 'option_a' }).success).toBe(true)
    })

    it('rejects empty string', () => {
      const schema = buildValidationSchema([field({ type: 'radio', required: true })])
      expect(schema.safeParse({ f1: '' }).success).toBe(false)
    })
  })

  describe('select field', () => {
    it('accepts a selected option string', () => {
      const schema = buildValidationSchema([field({ type: 'select', required: false })])
      expect(schema.safeParse({ f1: 'option_b' }).success).toBe(true)
    })
  })

  // ── checkbox ─────────────────────────────────────────────

  describe('checkbox field', () => {
    it('accepts an array of strings', () => {
      const schema = buildValidationSchema([field({ type: 'checkbox', required: false })])
      expect(schema.safeParse({ f1: ['a', 'b'] }).success).toBe(true)
    })

    it('accepts an empty array when not required', () => {
      const schema = buildValidationSchema([field({ type: 'checkbox', required: false })])
      expect(schema.safeParse({ f1: [] }).success).toBe(true)
    })

    it('rejects empty array when required', () => {
      const schema = buildValidationSchema([field({ type: 'checkbox', required: true })])
      expect(schema.safeParse({ f1: [] }).success).toBe(false)
    })

    it('accepts non-empty array when required', () => {
      const schema = buildValidationSchema([field({ type: 'checkbox', required: true })])
      expect(schema.safeParse({ f1: ['option'] }).success).toBe(true)
    })
  })

  // ── rating ───────────────────────────────────────────────

  describe('rating field', () => {
    it('accepts a rating of 1 or more', () => {
      const schema = buildValidationSchema([field({ type: 'rating', required: true })])
      expect(schema.safeParse({ f1: 3 }).success).toBe(true)
    })

    it('rejects rating of 0', () => {
      const schema = buildValidationSchema([field({ type: 'rating', required: true })])
      expect(schema.safeParse({ f1: 0 }).success).toBe(false)
    })
  })

  // ── date ─────────────────────────────────────────────────

  describe('date field', () => {
    it('accepts a date string', () => {
      const schema = buildValidationSchema([field({ type: 'date', required: true })])
      expect(schema.safeParse({ f1: '2024-01-15' }).success).toBe(true)
    })

    it('rejects empty string', () => {
      const schema = buildValidationSchema([field({ type: 'date', required: true })])
      expect(schema.safeParse({ f1: '' }).success).toBe(false)
    })
  })

  // ── multiple fields ───────────────────────────────────────

  describe('multiple fields', () => {
    it('validates all fields in the schema', () => {
      const fields: FormField[] = [
        { id: 'name', type: 'text', label: 'Name', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
      ]
      const schema = buildValidationSchema(fields)
      expect(schema.safeParse({ name: 'John', email: 'john@example.com' }).success).toBe(true)
      expect(schema.safeParse({ name: '', email: 'john@example.com' }).success).toBe(false)
      expect(schema.safeParse({ name: 'John', email: 'bad' }).success).toBe(false)
    })
  })
})
