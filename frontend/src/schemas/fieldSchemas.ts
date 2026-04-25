import { z } from 'zod'
import type { FormField } from '@/types/form'

export function buildValidationSchema(fields: FormField[]) {
	const shape: Record<string, z.ZodTypeAny> = {}

	for (const field of fields) {
		let schema: z.ZodTypeAny

		switch (field.type) {
			case 'email':
				schema = z.string().email('Invalid email address')
				break
			case 'number':
				schema = z.coerce.number({ error: 'Must be a number' })
				break
			case 'phone':
				schema = z.string().min(7, 'Invalid phone number')
				break
			case 'date':
				schema = z.string().min(1, 'Please select a date')
				break
			case 'radio':
			case 'select':
				schema = z.string().min(1, 'Please select an option')
				break
			case 'checkbox':
				schema = z.array(z.string())
				if (field.required) {
					schema = (schema as z.ZodArray<z.ZodString>).min(1, 'Please select at least one option')
				}
				break
			case 'rating':
				schema = z.coerce.number().min(1, 'Please provide a rating')
				break
			case 'file':
				schema = z.any()
				break
			default:
				schema = z.string()
		}

		if (field.required) {
			if (field.type === 'text' || field.type === 'textarea' || field.type === 'phone') {
				schema = (schema as z.ZodString).min(1, `${field.label} is required`)
			}
		} else if (field.type !== 'checkbox' && field.type !== 'rating' && field.type !== 'file') {
			schema = schema.optional()
		}

		shape[field.id] = schema
	}

	return z.object(shape)
}
