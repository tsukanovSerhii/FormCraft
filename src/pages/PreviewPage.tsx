import { HelpCircle, Lock, Send, Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PreviewTopBar } from '@/components/preview'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import type { FormField } from '@/types/form'

function FieldInput({ field }: { field: FormField }) {
	const [value, setValue] = useState(field.defaultValue ?? '')
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [rating, setRating] = useState(0)

	const inputClass = 'w-full rounded-lg border border-border bg-surface-secondary px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none'

	switch (field.type) {
		case 'text':
		case 'email':
		case 'phone':
		case 'number':
			return (
				<input
					type={field.type}
					value={value}
					onChange={e => setValue(e.target.value)}
					placeholder={field.placeholder ?? ''}
					className={inputClass}
				/>
			)

		case 'textarea':
			return (
				<textarea
					rows={4}
					value={value}
					onChange={e => setValue(e.target.value)}
					placeholder={field.placeholder ?? ''}
					className={`${inputClass} resize-none`}
				/>
			)

		case 'date':
			return (
				<input
					type="date"
					value={value}
					onChange={e => setValue(e.target.value)}
					className={inputClass}
				/>
			)

		case 'radio':
			return (
				<div className="flex flex-col gap-2">
					{(field.options ?? []).map(opt => (
						<label key={opt.id} className="flex cursor-pointer items-center gap-3">
							<span className={[
								'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
								value === opt.id ? 'border-brand' : 'border-border',
							].join(' ')}>
								{value === opt.id && <span className="h-2 w-2 rounded-full bg-brand" />}
							</span>
							<span className="text-[13px] text-text-primary">{opt.label}</span>
						</label>
					))}
				</div>
			)

		case 'checkbox':
			return (
				<div className="flex flex-col gap-2">
					{(field.options ?? []).map(opt => {
						const checked = selected.has(opt.id)
						return (
							<label key={opt.id} className="flex cursor-pointer items-center gap-3">
								<span
									onClick={() => setSelected(prev => {
										const next = new Set(prev)
										next.has(opt.id) ? next.delete(opt.id) : next.add(opt.id)
										return next
									})}
									className={[
										'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors',
										checked ? 'border-brand bg-brand' : 'border-border',
									].join(' ')}
								>
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

		case 'select':
			return (
				<select value={value} onChange={e => setValue(e.target.value)} className={inputClass}>
					<option value="">Select an option...</option>
					{(field.options ?? []).map(opt => (
						<option key={opt.id} value={opt.id}>{opt.label}</option>
					))}
				</select>
			)

		case 'rating': {
			const max = field.ratingMax ?? 5
			return (
				<div className="flex gap-1">
					{Array.from({ length: max }).map((_, i) => (
						<Star
							key={i}
							size={24}
							className={[
								'cursor-pointer transition-colors',
								i < rating ? 'fill-[#ffa502] text-[#ffa502]' : 'text-border hover:text-[#ffa502]',
							].join(' ')}
							onClick={() => setRating(i + 1)}
						/>
					))}
				</div>
			)
		}

		case 'file':
			return (
				<label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface-secondary py-8 transition-colors hover:border-brand-light">
					<p className="text-[13px] text-text-muted">Click to upload or drag & drop</p>
					<input type="file" className="hidden" />
				</label>
			)

		default:
			return null
	}
}

export default function PreviewPage() {
	const { formId } = useParams<{ formId: string }>()
	const navigate = useNavigate()
	const { forms } = useFormBuilderStore()
	const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

	const form = forms.find(f => f.id === formId)

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

	return (
		<div className="flex min-h-screen flex-col bg-surface-secondary">
			<PreviewTopBar title={form.title} viewMode={viewMode} onViewModeChange={setViewMode} formId={formId} />

			<div className="flex-1 overflow-y-auto px-6 py-10">
				<div className={[
					'mx-auto transition-all duration-300',
					viewMode === 'mobile' ? 'max-w-sm' : 'max-w-xl',
				].join(' ')}>
					{/* Title */}
					<div className="mb-8 text-center">
						<h1 className="text-[28px] font-bold text-text-primary">{form.title}</h1>
						{form.description && (
							<p className="mt-2 text-[14px] text-text-secondary">{form.description}</p>
						)}
					</div>

					{/* Form card */}
					<div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-panel">
						<div className="h-1.5 bg-brand" />

						{form.fields.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 text-text-muted">
								<p className="text-[14px]">This form has no fields yet.</p>
							</div>
						) : (
							<div className="flex flex-col gap-6 p-8">
								{form.fields.map((field, i) => (
									<div key={field.id}>
										{i > 0 && <div className="mb-6 h-px bg-border" />}
										<label className="mb-2 block text-[13px] font-medium text-text-primary">
											{field.label}
											{field.required && <span className="ml-1 text-error">*</span>}
										</label>
										<FieldInput field={field} />
									</div>
								))}

								{/* Submit */}
								<div className="pt-2">
									<button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[14px] font-semibold text-white shadow-button transition-colors hover:bg-brand-dark">
										Submit
										<Send size={14} />
									</button>
									<p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-text-muted">
										<Lock size={11} />
										Your data is securely stored and private.
									</p>
								</div>
							</div>
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
	)
}
