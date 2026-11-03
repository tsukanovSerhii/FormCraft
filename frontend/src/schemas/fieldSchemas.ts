import { z } from 'zod'
import { evaluateCondition } from '@/lib/conditions'
import type { FormField } from '@/types/form'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s().-]{5,}$/

// Inputs start as '' (or [] / 0 for checkbox / rating), so "empty" covers all of them
export function isEmptyValue(field: FormField, value: unknown): boolean {
	if (value === undefined || value === null) return true
	if (typeof value === 'string') return value.trim() === ''
	if (Array.isArray(value)) return value.length === 0
	if (field.type === 'rating') return Number(value) === 0
	return false
}

// Type check for a non-empty value; returns an error message or null
function checkValue(field: FormField, value: unknown): string | null {
	switch (field.type) {
		case 'email':
			return EMAIL_RE.test(String(value)) ? null : 'Invalid email address'
		case 'phone':
			return PHONE_RE.test(String(value)) ? null : 'Invalid phone number'
		case 'number':
			return Number.isFinite(Number(value)) ? null : 'Must be a number'
		case 'rating': {
			const n = Number(value)
			const max = field.ratingMax ?? 5
			return Number.isInteger(n) && n >= 1 && n <= max ? null : `Rating must be between 1 and ${max}`
		}
		case 'checkbox':
			return Array.isArray(value) ? null : 'Please select at least one option'
		default:
			return null
	}
}

function requiredMessage(field: FormField): string {
	switch (field.type) {
		case 'radio':
		case 'select':
			return 'Please select an option'
		case 'checkbox':
			return 'Please select at least one option'
		case 'rating':
			return 'Please provide a rating'
		case 'date':
			return 'Please select a date'
		case 'file':
			return 'Please attach a file'
		default:
			return `${field.label} is required`
	}
}

// Validates the whole response at once: a field's visibility depends on other answers,
// so hidden fields (condition not met) are skipped and never block submission
export function buildValidationSchema(fields: FormField[]) {
	const shape = Object.fromEntries(fields.map(f => [f.id, z.any()]))

	return z.object(shape).superRefine((values, ctx) => {
		for (const field of fields) {
			if (!evaluateCondition(field.condition, values)) continue

			const value = values[field.id]
			if (isEmptyValue(field, value)) {
				if (field.required) ctx.addIssue({ code: 'custom', path: [field.id], message: requiredMessage(field) })
				continue
			}

			const error = checkValue(field, value)
			if (error) ctx.addIssue({ code: 'custom', path: [field.id], message: error })
		}
	})
}

// Payload sent to the API: only answers to visible fields, empty values dropped,
// numbers as numbers. Files aren't uploaded (no storage) — only their metadata is kept.
export function prepareSubmission(fields: FormField[], values: Record<string, unknown>) {
	const data: Record<string, unknown> = {}
	for (const field of fields) {
		if (!evaluateCondition(field.condition, values)) continue
		const value = values[field.id]
		if (isEmptyValue(field, value)) continue

		if (field.type === 'number' || field.type === 'rating') data[field.id] = Number(value)
		else if (field.type === 'file' && value instanceof File) data[field.id] = { name: value.name, size: value.size, type: value.type }
		else data[field.id] = value
	}
	return data
}
