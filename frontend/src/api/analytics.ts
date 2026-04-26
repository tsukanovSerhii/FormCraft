import { api } from './client'

export interface FieldOption {
  label: string
  count: number
}

export interface FieldDistribution {
  fieldId: string
  label: string
  type: string
  options: FieldOption[]
}

export interface FormAnalytics {
  formId: string
  formTitle: string
  totalResponses: number
  totalAllTime: number
  byDay: Record<string, number>
  byHour: number[]
  byDow: number[]
  fieldDistribution: FieldDistribution[]
}

export const analyticsApi = {
  getFormAnalytics: (formId: string, days = 30) =>
    api.get<FormAnalytics>(`/api/forms/${formId}/analytics?days=${days}`),
}
