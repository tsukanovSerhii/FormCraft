import { GripVertical, Plus, Star, X } from 'lucide-react'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import { Input, Textarea } from '@/components/ui'
import { uid } from '@/lib/uid'
import type { FieldOption, FormField } from '@/types/form'

interface OptionsEditorInlineProps {
	options: FieldOption[]
	shape: 'round' | 'square'
	onUpdate: (options: FieldOption[]) => void
}

function OptionsEditorInline({ options, shape, onUpdate }: OptionsEditorInlineProps) {
	function updateLabel(id: string, label: string) {
		onUpdate(options.map(o => o.id === id ? { ...o, label } : o))
	}

	function removeOption(id: string) {
		if (options.length <= 1) return
		onUpdate(options.filter(o => o.id !== id))
	}

	function addOption() {
		onUpdate([...options, { id: uid(), label: `Option ${options.length + 1}` }])
	}

	return (
		<div className="flex flex-col gap-1.5">
			{options.map(opt => (
				<div key={opt.id} className="group/opt flex items-center gap-2">
					<span className={[
						'flex h-4 w-4 shrink-0 border border-border bg-surface',
						shape === 'round' ? 'rounded-full' : 'rounded',
					].join(' ')} />
					<input
						value={opt.label}
						onChange={e => updateLabel(opt.id, e.target.value)}
						className="min-w-0 flex-1 bg-transparent text-[13px] text-text-primary outline-none focus:border-b focus:border-brand"
					/>
					<button
						onClick={() => removeOption(opt.id)}
						className="opacity-0 transition-opacity group-hover/opt:opacity-100 text-text-muted hover:text-error"
					>
						<X size={13} />
					</button>
				</div>
			))}
			<button
				onClick={addOption}
				className="flex items-center gap-1.5 pt-1 text-[12px] font-medium text-brand hover:underline"
			>
				<Plus size={13} /> Add option
			</button>
		</div>
	)
}

interface FieldPreviewProps {
	field: FormField
	onUpdate: (patch: Partial<FormField>) => void
}

function FieldPreview({ field, onUpdate }: FieldPreviewProps) {
	switch (field.type) {
		case 'text':
		case 'email':
		case 'phone':
		case 'number':
			return (
				<Input
					type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
					value={field.defaultValue ?? ''}
					placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
					onChange={e => onUpdate({ defaultValue: e.target.value })}
				/>
			)

		case 'textarea':
			return (
				<Textarea
					rows={3}
					value={field.defaultValue ?? ''}
					placeholder={field.placeholder || 'Enter your answer...'}
					onChange={e => onUpdate({ defaultValue: e.target.value })}
				/>
			)

		case 'date':
			return (
				<Input
					type="date"
					value={field.defaultValue ?? ''}
					onChange={e => onUpdate({ defaultValue: e.target.value })}
				/>
			)

		case 'radio':
			return (
				<OptionsEditorInline
					options={field.options ?? []}
					shape="round"
					onUpdate={options => onUpdate({ options })}
				/>
			)

		case 'checkbox':
			return (
				<OptionsEditorInline
					options={field.options ?? []}
					shape="square"
					onUpdate={options => onUpdate({ options })}
				/>
			)

		case 'select':
			return (
				<OptionsEditorInline
					options={field.options ?? []}
					shape="square"
					onUpdate={options => onUpdate({ options })}
				/>
			)

		case 'rating': {
			const max = field.ratingMax ?? 5
			const current = Number(field.defaultValue ?? 0)
			return (
				<div className="flex gap-1">
					{Array.from({ length: max }).map((_, i) => (
						<Star
							key={i}
							size={20}
							className={i < current ? 'fill-[#ffa502] text-[#ffa502]' : 'text-text-placeholder'}
							onClick={() => onUpdate({ defaultValue: String(i + 1) })}
							style={{ cursor: 'pointer' }}
						/>
					))}
				</div>
			)
		}

		case 'file':
			return (
				<div className="flex items-center justify-center rounded-md border-2 border-dashed border-border bg-surface-secondary py-6 text-[13px] text-text-muted">
					Click to upload or drag & drop
				</div>
			)

		default:
			return null
	}
}

interface FieldItemProps {
	field: FormField
	isSelected: boolean
}

export default function FieldItem({ field, isSelected }: FieldItemProps) {
	const { selectField, updateField } = useFormBuilderStore()

	return (
		<div
			onMouseDown={() => selectField(field.id)}
			className={[
				'group relative flex cursor-pointer items-start gap-3 rounded-lg border bg-surface px-5 py-4 shadow-card transition-all',
				isSelected ? 'border-brand ring-1 ring-brand' : 'border-border hover:border-brand-light',
			].join(' ')}
		>
			<GripVertical size={16} className="mt-1 shrink-0 cursor-grab text-text-placeholder opacity-0 group-hover:opacity-100" />
			<div className="min-w-0 flex-1">
				<div className="mb-2 flex items-center gap-1">
					<p className="text-[14px] font-medium text-text-primary">{field.label}</p>
					{field.required && <span className="text-[12px] text-error">*</span>}
				</div>
				<FieldPreview field={field} onUpdate={patch => updateField(field.id, patch)} />
			</div>
		</div>
	)
}
