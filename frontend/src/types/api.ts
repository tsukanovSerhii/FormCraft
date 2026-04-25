import type { FormField } from './form'

export interface ApiForm {
  id: string
  title: string
  description: string | null
  status: string
  fields: FormField[]
  createdAt: string
  updatedAt: string
  userId: string
}

export interface ApiResponse {
  id: string
  formId: string
  data: Record<string, unknown>
  submittedAt: string
  userId: string | null
}
