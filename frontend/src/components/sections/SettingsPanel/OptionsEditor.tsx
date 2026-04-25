import { GripVertical, X } from 'lucide-react'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { SectionLabel } from '@/components/ui'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import { uid } from '@/lib/uid'
import type { FieldOption } from '@/types/form'

interface SortableOptionRowProps {
	option: FieldOption
	index: number
	groupId: string
	canRemove: boolean
	onLabelChange: (id: string, label: string) => void
	onRemove: (id: string) => void
}

function SortableOptionRow({ option, index, groupId, canRemove, onLabelChange, onRemove }: SortableOptionRowProps) {
	const { ref, handleRef, isDragging } = useSortable({ id: option.id, index, group: groupId })

	return (
		<div
			ref={ref}
			style={{ opacity: isDragging ? 0.4 : 1 }}
			className="flex items-center gap-2 rounded-md border border-border bg-surface-secondary px-2 py-1.5"
		>
			<button ref={handleRef} className="shrink-0 cursor-grab text-text-muted hover:text-text-secondary">
				<GripVertical size={13} />
			</button>
			<input
				type="text"
				value={option.label}
				onChange={e => onLabelChange(option.id, e.target.value)}
				className="min-w-0 flex-1 bg-transparent text-[13px] text-text-primary outline-none"
			/>
			{canRemove && (
				<button
					onClick={() => onRemove(option.id)}
					className="shrink-0 text-text-muted transition-colors hover:text-error"
				>
					<X size={13} />
				</button>
			)}
		</div>
	)
}

interface OptionsEditorProps {
	fieldId: string
	options: FieldOption[]
}

export default function OptionsEditor({ fieldId, options }: OptionsEditorProps) {
	const { updateField } = useFormBuilderStore()
	const groupId = `settings-options-${fieldId}`

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
			<DragDropProvider
				onDragEnd={({ operation }) => {
					const { source, target } = operation
					if (!source || !target || source.id === target.id) return
					const from = options.findIndex(o => o.id === source.id)
					const to = options.findIndex(o => o.id === target.id)
					if (from === -1 || to === -1) return
					const reordered = [...options]
					const [moved] = reordered.splice(from, 1)
					reordered.splice(to, 0, moved)
					updateField(fieldId, { options: reordered })
				}}
			>
				<div className="flex flex-col gap-1.5">
					{options.map((option, index) => (
						<SortableOptionRow
							key={option.id}
							option={option}
							index={index}
							groupId={groupId}
							canRemove={options.length > 1}
							onLabelChange={updateLabel}
							onRemove={removeOption}
						/>
					))}
				</div>
			</DragDropProvider>
		</div>
	)
}
