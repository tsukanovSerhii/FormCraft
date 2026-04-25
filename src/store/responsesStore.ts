import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '@/lib/uid'

export interface FormResponse {
  id: string
  formId: string
  formTitle: string
  submittedAt: number
  data: Record<string, unknown>
}

interface ResponsesState {
  responses: FormResponse[]
  addResponse: (formId: string, formTitle: string, data: Record<string, unknown>) => void
  clearResponses: (formId: string) => void
}

export const useResponsesStore = create<ResponsesState>()(
  persist(
    set => ({
      responses: [],

      addResponse(formId, formTitle, data) {
        const response: FormResponse = {
          id: uid(),
          formId,
          formTitle,
          submittedAt: Date.now(),
          data,
        }
        set(s => ({ responses: [response, ...s.responses] }))
      },

      clearResponses(formId) {
        set(s => ({ responses: s.responses.filter(r => r.formId !== formId) }))
      },
    }),
    { name: 'formcraft-responses' }
  )
)

export const useFormResponses = (formId: string) =>
  useResponsesStore(s => s.responses.filter(r => r.formId === formId))
