import { responsesApi } from '@/api/responses'
import { uid } from '@/lib/uid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FormResponse {
	id: string
	formId: string
	formTitle: string
	submittedAt: number
	data: Record<string, unknown>
}

interface ResponsesState {
	responses: FormResponse[]
	addResponse: (
		formId: string,
		formTitle: string,
		data: Record<string, unknown>
	) => Promise<void>
	fetchResponses: (formId: string, formTitle: string) => Promise<void>
	clearResponses: (formId: string) => void
}

export const useResponsesStore = create<ResponsesState>()(
	persist(
		set => ({
			responses: [],

			async addResponse(formId, formTitle, data) {
				const response: FormResponse = {
					id: uid(),
					formId,
					formTitle,
					submittedAt: Date.now(),
					data
				}
				set(s => ({ responses: [response, ...s.responses] }))

				try {
					await responsesApi.submit(formId, data)
				} catch {
					/* keep local response on failure */
				}
			},

			async fetchResponses(formId, formTitle) {
				try {
					const remote = await responsesApi.getAll(formId)
					const mapped: FormResponse[] = remote.map(r => ({
						...r,
						formTitle
					}))
					set(s => ({
						responses: [
							...mapped,
							...s.responses.filter(r => r.formId !== formId)
						]
					}))
				} catch {
					/* offline fallback */
				}
			},

			clearResponses(formId) {
				set(s => ({ responses: s.responses.filter(r => r.formId !== formId) }))
			}
		}),
		{ name: 'formcraft-responses' }
	)
)

export const useFormResponses = (formId: string) =>
	useResponsesStore(s => s.responses.filter(r => r.formId === formId))
