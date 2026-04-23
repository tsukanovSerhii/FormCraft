export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'rating'

export interface FieldOption {
  id: string
  label: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: FieldOption[]
  ratingMax?: number
  defaultValue?: string
}

export interface Form {
  id: string
  title: string
  description?: string
  fields: FormField[]
  status: 'draft' | 'published'
  responses: number
  createdAt: number
  updatedAt: number
}
