export type FieldType =
	| 'text'
	| 'textarea'
	| 'number'
	| 'email'
	| 'phone'
	| 'radio'
	| 'checkbox'
	| 'select'
	| 'date'
	| 'file'
	| 'rating'

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
	text:     'Short Text',
	textarea: 'Long Text',
	number:   'Number',
	email:    'Email',
	phone:    'Phone',
	radio:    'Multiple Choice',
	checkbox: 'Checkboxes',
	select:   'Dropdown',
	date:     'Date',
	file:     'File Upload',
	rating:   'Rating',
}

export const OPTIONS_TYPES: FieldType[] = ['radio', 'checkbox', 'select']
export const PLACEHOLDER_TYPES: FieldType[] = ['text', 'textarea', 'number', 'email', 'phone']
