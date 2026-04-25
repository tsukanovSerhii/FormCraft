import { Copy, Eye, Trash2 } from 'lucide-react'
import { Badge, Button, Input, SectionLabel, Textarea, Toggle } from '@/components/ui'
import { useActiveForm, useFormBuilderStore, useSelectedField } from '@/store/formBuilderStore'
import type { ConditionOperator } from '@/types/form'
import DateConfig from './DateConfig'
import FileConfig from './FileConfig'
import OptionsEditor from './OptionsEditor'
import RatingConfig from './RatingConfig'
import { FIELD_TYPE_LABELS, OPTIONS_TYPES, PLACEHOLDER_TYPES } from './types'

const OPERATORS: { value: ConditionOperator; label: string }[] = [
	{ value: 'equals', label: 'equals' },
	{ value: 'not_equals', label: 'does not equal' },
	{ value: 'contains', label: 'contains' },
	{ value: 'not_empty', label: 'is not empty' },
]

export default function SettingsPanel() {
	const field = useSelectedField()
	const form = useActiveForm()
	const { updateField, duplicateField, removeField } = useFormBuilderStore()

	const otherFields = form?.fields.filter(f => f.id !== field?.id) ?? []

	if (!field) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
				<p className="text-[13px] font-medium text-text-muted">Select a field to edit its settings</p>
			</div>
		)
	}

	const hasOptions = OPTIONS_TYPES.includes(field.type)
	const hasPlaceholder = PLACEHOLDER_TYPES.includes(field.type)

	return (
		<div className="flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-border px-4 py-3">
				<SectionLabel>Settings</SectionLabel>
				<Badge>{FIELD_TYPE_LABELS[field.type]}</Badge>
			</div>

			<div className="flex flex-col gap-5 p-4">
				{/* Field label */}
				<div className="flex flex-col gap-2">
					<SectionLabel>Field Label</SectionLabel>
					<Input
						value={field.label}
						onChange={e => updateField(field.id, { label: e.target.value })}
					/>
				</div>

				{/* Placeholder */}
				{hasPlaceholder && (
					<div className="flex flex-col gap-2">
						<SectionLabel>Placeholder</SectionLabel>
						<Input
							value={field.placeholder ?? ''}
							placeholder="Enter placeholder text..."
							onChange={e => updateField(field.id, { placeholder: e.target.value })}
						/>
					</div>
				)}

				{/* Required toggle */}
				<div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
					<div>
						<p className="text-[13px] font-medium text-text-primary">Required</p>
						<p className="text-[11px] text-text-muted">Mandatory for submission</p>
					</div>
					<Toggle
						checked={field.required}
						onChange={checked => updateField(field.id, { required: checked })}
					/>
				</div>

				{/* Options */}
				{hasOptions && (
					<OptionsEditor fieldId={field.id} options={field.options ?? []} />
				)}

				{/* Rating config */}
				{field.type === 'rating' && (
					<RatingConfig fieldId={field.id} ratingMax={field.ratingMax ?? 5} />
				)}

				{/* Date config */}
				{field.type === 'date' && (
					<DateConfig fieldId={field.id} defaultValue={field.defaultValue} />
				)}

				{/* File config */}
				{field.type === 'file' && <FileConfig />}

				{/* Conditional logic */}
				{otherFields.length > 0 && (
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<SectionLabel>Show if</SectionLabel>
							<Toggle
								checked={!!field.condition}
								onChange={on => updateField(field.id, {
									condition: on
										? { fieldId: otherFields[0].id, operator: 'not_empty', value: '' }
										: undefined,
								})}
							/>
						</div>
						{field.condition && (
							<div className="flex flex-col gap-2 rounded-md border border-border p-3">
								<select
									value={field.condition.fieldId}
									onChange={e => updateField(field.id, { condition: { ...field.condition!, fieldId: e.target.value } })}
									className="rounded-md border border-border bg-surface px-2 py-1.5 text-[12px] text-text-primary"
								>
									{otherFields.map(f => (
										<option key={f.id} value={f.id}>{f.label}</option>
									))}
								</select>
								<select
									value={field.condition.operator}
									onChange={e => updateField(field.id, { condition: { ...field.condition!, operator: e.target.value as ConditionOperator } })}
									className="rounded-md border border-border bg-surface px-2 py-1.5 text-[12px] text-text-primary"
								>
									{OPERATORS.map(op => (
										<option key={op.value} value={op.value}>{op.label}</option>
									))}
								</select>
								{field.condition.operator !== 'not_empty' && (
									<Input
										value={field.condition.value}
										placeholder="Value..."
										onChange={e => updateField(field.id, { condition: { ...field.condition!, value: e.target.value } })}
									/>
								)}
							</div>
						)}
					</div>
				)}

				{/* Help text */}
				<div className="flex flex-col gap-2">
					<SectionLabel>Help Text</SectionLabel>
					<Textarea placeholder="Add instructions for users..." rows={3} />
				</div>
			</div>

			{/* Actions */}
			<div className="mt-auto flex gap-2 border-t border-border p-4">
				<Button
					variant="outline"
					className="flex-1"
					icon={<Copy size={13} />}
					onClick={() => duplicateField(field.id)}
				>
					Duplicate
				</Button>
				<Button
					variant="danger"
					className="flex-1"
					icon={<Trash2 size={13} />}
					onClick={() => removeField(field.id)}
				>
					Delete
				</Button>
			</div>

			{/* Preview hint */}
			<div className="mx-4 mb-4 flex items-center gap-2 rounded-md bg-text-primary px-3 py-2.5">
				<Eye size={14} className="shrink-0 text-white opacity-70" />
				<div className="min-w-0">
					<p className="text-[11px] font-semibold uppercase tracking-wider text-white opacity-60">
						Preview Mode
					</p>
					<p className="text-[12px] font-medium text-white">Everything looks good!</p>
				</div>
			</div>
		</div>
	)
}
