import { Copy, Eye, Trash2 } from 'lucide-react'
import { Badge, Button, Input, SectionLabel, Textarea, Toggle } from '@/components/ui'
import FileConfig from './FileConfig'
import OptionsEditor from './OptionsEditor'
import RatingConfig from './RatingConfig'
import { FIELD_TYPE_LABELS, OPTIONS_TYPES, PLACEHOLDER_TYPES, type FieldType } from './types'

interface SettingsPanelProps {
	fieldType?: FieldType
}

export default function SettingsPanel({ fieldType = 'radio' }: SettingsPanelProps) {
	const hasOptions = OPTIONS_TYPES.includes(fieldType)
	const hasPlaceholder = PLACEHOLDER_TYPES.includes(fieldType)

	return (
		<div className="flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-border px-4 py-3">
				<SectionLabel>Settings</SectionLabel>
				<Badge>{FIELD_TYPE_LABELS[fieldType]}</Badge>
			</div>

			<div className="flex flex-col gap-5 p-4">
				{/* Field label */}
				<div className="flex flex-col gap-2">
					<SectionLabel>Field Label</SectionLabel>
					<Input defaultValue="How did you hear about us?" />
				</div>

				{/* Placeholder — text-like fields only */}
				{hasPlaceholder && (
					<div className="flex flex-col gap-2">
						<SectionLabel>Placeholder</SectionLabel>
						<Input placeholder="Enter placeholder text..." />
					</div>
				)}

				{/* Required toggle */}
				<div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
					<div>
						<p className="text-[13px] font-medium text-text-primary">Required</p>
						<p className="text-[11px] text-text-muted">Mandatory for submission</p>
					</div>
					<Toggle checked />
				</div>

				{/* Options — choice fields */}
				{hasOptions && <OptionsEditor />}

				{/* Rating config */}
				{fieldType === 'rating' && <RatingConfig />}

				{/* File config */}
				{fieldType === 'file' && <FileConfig />}

				{/* Help text */}
				<div className="flex flex-col gap-2">
					<SectionLabel>Help Text</SectionLabel>
					<Textarea placeholder="Add instructions for users..." rows={3} />
				</div>
			</div>

			{/* Actions */}
			<div className="mt-auto flex gap-2 border-t border-border p-4">
				<Button variant="outline" className="flex-1" icon={<Copy size={13} />}>
					Duplicate
				</Button>
				<Button variant="danger" className="flex-1" icon={<Trash2 size={13} />}>
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
