import type { FieldType } from '@/types/form'
import { z } from 'zod'

export const fieldOptionSchema = z.object({
	label: z.string().min(1),
	value: z.string().min(1)
})

export const formFieldSchema = z.object({
	id: z.string(),
	type: z.enum([
		'text',
		'textarea',
		'number',
		'email',
		'select',
		'checkbox',
		'radio',
		'date'
	]),
	label: z.string().min(1, 'Label is required'),
	placeholder: z.string().optional(),
	required: z.boolean(),
	options: z.array(fieldOptionSchema).optional()
})

export const formSchema = z.object({
	id: z.string(),
	title: z.string().min(1, 'Form title is required'),
	description: z.string().optional(),
	fields: z.array(formFieldSchema),
	createdAt: z.number(),
	updatedAt: z.number()
})

export function buildValidationSchema(
	fields: z.infer<typeof formFieldSchema>[]
) {
	const shape: Record<string, z.ZodTypeAny> = {}

	for (const field of fields) {
		let schema: z.ZodTypeAny

		switch (field.type as FieldType) {
			case 'email':
				schema = z.string().email()
				break
			case 'number':
				schema = z.coerce.number()
				break
			case 'checkbox':
				schema = z.boolean()
				break
			default:
				schema = z.string()
		}

		if (!field.required) {
			schema = schema.optional()
		} else if (field.type !== 'checkbox' && field.type !== 'number') {
			schema = (schema as z.ZodString).min(1, `${field.label} is required`)
		}

		shape[field.id] = schema
	}

	return z.object(shape)
}
