import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, HelpCircle, Lock, Send, Star } from 'lucide-react'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { PreviewTopBar } from '@/components/preview'
import { buildValidationSchema } from '@/schemas/fieldSchemas'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import { useResponsesStore } from '@/store/responsesStore'
import type { FormField } from '@/types/form'

const inputClass = 'w-full rounded-lg border border-border bg-surface-secondary px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none transition-colors'
const errorClass = 'border-error focus:border-error'

interface FieldInputProps {
	field: FormField
	error?: string
}

function FieldInput({ field, error }: FieldInputProps) {
	const [rating, setRating] = useState(0)

	switch (field.type) {
		case 'text':
		case 'email':
		case 'phone':
		case 'number':
			return (
				<Controller
					name={field.id}
					render={({ field: f }) => (
						<input
							{...f}
							type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
							placeholder={field.placeholder ?? ''}
							className={[inputClass, error ? errorClass : ''].join(' ')}
						/>
					)}
				/>
			)

		case 'textarea':
			return (
				<Controller
					name={field.id}
					render={({ field: f }) => (
						<textarea
							{...f}
							rows={4}
							placeholder={field.placeholder ?? ''}
							className={[inputClass, 'resize-none', error ? errorClass : ''].join(' ')}
						/>
					)}
				/>
			)

		case 'date':
			return (
				<Controller
					name={field.id}
					render={({ field: f }) => (
						<input
							{...f}
							type="date"
							className={[inputClass, error ? errorClass : ''].join(' ')}
						/>
					)}
				/>
			)

		case 'radio':
			return (
				<Controller
					name={field.id}
					render={({ field: f }) => (
						<div className="flex flex-col gap-2">
							{(field.options ?? []).map(opt => (
								<label key={opt.id} className="flex cursor-pointer items-center gap-3">
									<span className={[
										'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
										f.value === opt.id ? 'border-brand' : error ? 'border-error' : 'border-border',
									].join(' ')}>
										{f.value === opt.id && <span className="h-2 w-2 rounded-full bg-brand" />}
									</span>
									<span className="text-[13px] text-text-primary">{opt.label}</span>
									<input type="radio" className="hidden" checked={f.value === opt.id} onChange={() => f.onChange(opt.id)} />
								</label>
							))}
						</div>
					)}
				/>
			)

		case 'checkbox':
			return (
				<Controller
					name={field.id}
					render={({ field: f }) => {
						const selected: string[] = f.value ?? []
						function toggle(id: string) {
							f.onChange(selected.includes(id) ? selected.filter(v => v !== id) : [...selected, id])
						}
						return (
							<div className="flex flex-col gap-2">
								{(field.options ?? []).map(opt => {
									const checked = selected.includes(opt.id)
									return (
										<label key={opt.id} onClick={() => toggle(opt.id)} className="flex cursor-pointer items-center gap-3">
											<span className={[
												'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors',
												checked ? 'border-brand bg-brand' : error ? 'border-error' : 'border-border',
											].join(' ')}>
												{checked && (
													<svg width="9" height="7" viewBox="0 0 9 7" fill="none">
														<path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												)}
											</span>
											<span className="text-[13px] text-text-primary">{opt.label}</span>
										</label>
									)
								})}
							</div>
						)
					}}
				/>
			)

		case 'select':
			return (
				<Controller
					name={field.id}
					render={({ field: f }) => (
						<select
							{...f}
							className={[inputClass, error ? errorClass : ''].join(' ')}
						>
							<option value="">Select an option...</option>
							{(field.options ?? []).map(opt => (
								<option key={opt.id} value={opt.id}>{opt.label}</option>
							))}
						</select>
					)}
				/>
			)

		case 'rating': {
			const max = field.ratingMax ?? 5
			return (
				<Controller
					name={field.id}
					render={({ field: f }) => {
						const current = Number(f.value ?? 0) || rating
						return (
							<div className="flex gap-1">
								{Array.from({ length: max }).map((_, i) => (
									<Star
										key={i}
										size={24}
										className={[
											'cursor-pointer transition-colors',
											i < current ? 'fill-[#ffa502] text-[#ffa502]' : error ? 'text-error' : 'text-border hover:text-[#ffa502]',
										].join(' ')}
										onClick={() => { setRating(i + 1); f.onChange(i + 1) }}
									/>
								))}
							</div>
						)
					}}
				/>
			)
		}

		case 'file':
			return (
				<Controller
					name={field.id}
					render={({ field: f }) => (
						<label className={[
							'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 transition-colors',
							error ? 'border-error' : 'border-border hover:border-brand-light',
						].join(' ')}>
							<p className="text-[13px] text-text-muted">
								{f.value ? (f.value as File).name : 'Click to upload or drag & drop'}
							</p>
							<input type="file" className="hidden" onChange={e => f.onChange(e.target.files?.[0])} />
						</label>
					)}
				/>
			)

		default:
			return null
	}
}

function SuccessScreen({ title, onReset }: { title: string; onReset: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-light text-success">
				<CheckCircle2 size={32} />
			</div>
			<h2 className="mt-5 text-[20px] font-bold text-text-primary">Response submitted!</h2>
			<p className="mt-2 text-[13px] text-text-muted">Thank you for filling out <span className="font-medium">{title}</span>.</p>
			<button
				onClick={onReset}
				className="mt-6 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-secondary"
			>
				Submit another response
			</button>
		</div>
	)
}

export default function PreviewPage() {
	const { formId } = useParams<{ formId: string }>()
	const navigate = useNavigate()
	const { forms } = useFormBuilderStore()
	const { addResponse } = useResponsesStore()
	const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
	const [submitted, setSubmitted] = useState(false)

	const form = forms.find(f => f.id === formId)
	const schema = form ? buildValidationSchema(form.fields) : null

	const methods = useForm({
		resolver: schema ? zodResolver(schema) : undefined,
		defaultValues: form?.fields.reduce((acc, f) => {
			acc[f.id] = f.type === 'checkbox' ? [] : (f.defaultValue ?? '')
			return acc
		}, {} as Record<string, unknown>),
	})
	const { handleSubmit, formState: { errors }, reset } = methods

	if (!form) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-4 bg-surface-secondary">
				<p className="text-[16px] font-semibold text-text-primary">Form not found</p>
				<button
					onClick={() => navigate('/forms')}
					className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark"
				>
					Back to Dashboard
				</button>
			</div>
		)
	}

	function onSubmit(data: Record<string, unknown>) {
		addResponse(form!.id, form!.title, data)
		setSubmitted(true)
	}

	function handleReset() {
		reset()
		setSubmitted(false)
	}

	return (
		<FormProvider {...methods}>
		<div className="flex min-h-screen flex-col bg-surface-secondary">
			<PreviewTopBar title={form.title} viewMode={viewMode} onViewModeChange={setViewMode} formId={formId} />

			<div className="flex-1 overflow-y-auto px-6 py-10">
				<div className={['mx-auto transition-all duration-300', viewMode === 'mobile' ? 'max-w-sm' : 'max-w-xl'].join(' ')}>
					<div className="mb-8 text-center">
						<h1 className="text-[28px] font-bold text-text-primary">{form.title}</h1>
						{form.description && (
							<p className="mt-2 text-[14px] text-text-secondary">{form.description}</p>
						)}
					</div>

					<div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-panel">
						<div className="h-1.5 bg-brand" />

						{submitted ? (
							<SuccessScreen title={form.title} onReset={handleReset} />
						) : form.fields.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 text-text-muted">
								<p className="text-[14px]">This form has no fields yet.</p>
							</div>
						) : (
							<form onSubmit={handleSubmit(onSubmit as never)} className="flex flex-col gap-6 p-8">
								{form.fields.map((field, i) => (
									<div key={field.id}>
										{i > 0 && <div className="mb-6 h-px bg-border" />}
										<label className="mb-2 block text-[13px] font-medium text-text-primary">
											{field.label}
											{field.required && <span className="ml-1 text-error">*</span>}
										</label>
										<FieldInput field={field} error={errors[field.id]?.message as string} />
										{errors[field.id] && (
											<p className="mt-1.5 text-[12px] text-error">
												{errors[field.id]?.message as string}
											</p>
										)}
									</div>
								))}

								<div className="pt-2">
									<button
										type="submit"
										className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[14px] font-semibold text-white shadow-button transition-colors hover:bg-brand-dark"
									>
										Submit <Send size={14} />
									</button>
									<p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-text-muted">
										<Lock size={11} /> Your data is securely stored and private.
									</p>
								</div>
							</form>
						)}
					</div>

					<p className="mt-8 text-center text-[12px] text-text-muted">
						Powered by <span className="font-bold text-text-secondary">FormCraft</span>
					</p>
				</div>
			</div>

			<div className="fixed bottom-5 left-5 flex items-center gap-2 rounded-full bg-text-primary px-4 py-2 shadow-panel">
				<span className="h-2 w-2 rounded-full bg-success" />
				<span className="text-[12px] font-semibold text-white">LIVE PREVIEW</span>
			</div>

			<button className="fixed bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-muted shadow-card transition-colors hover:text-text-primary">
				<HelpCircle size={16} />
			</button>
		</div>
		</FormProvider>
	)
}
