import { GripVertical, X } from 'lucide-react'
import { SectionLabel } from '@/components/ui'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import { uid } from '@/lib/uid'
import type { FieldOption } from '@/types/form'

interface OptionsEditorProps {
	fieldId: string
	options: FieldOption[]
}

export default function OptionsEditor({ fieldId, options }: OptionsEditorProps) {
	const { updateField } = useFormBuilderStore()

	function addOption() {
		updateField(fieldId, {
			options: [...options, { id: uid(), label: `Option ${options.length + 1}` }],
		})
	}

	function removeOption(id: string) {
		updateField(fieldId, { options: options.filter(o => o.id !== id) })
	}

	function updateLabel(id: string, label: string) {
		updateField(fieldId, { options: options.map(o => o.id === id ? { ...o, label } : o) })
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<SectionLabel>Options</SectionLabel>
				<button onClick={addOption} className="text-[11px] font-semibold text-brand hover:underline">
					+ Add Option
				</button>
			</div>
			<div className="flex flex-col gap-1.5">
				{options.map(option => (
					<div
						key={option.id}
						className="flex items-center gap-2 rounded-md border border-border bg-surface-secondary px-2 py-1.5"
					>
						<GripVertical size={13} className="shrink-0 cursor-grab text-text-muted" />
						<input
							type="text"
							value={option.label}
							onChange={e => updateLabel(option.id, e.target.value)}
							className="min-w-0 flex-1 bg-transparent text-[13px] text-text-primary outline-none"
						/>
						<button
							onClick={() => removeOption(option.id)}
							className="shrink-0 text-text-muted transition-colors hover:text-error"
						>
							<X size={13} />
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
