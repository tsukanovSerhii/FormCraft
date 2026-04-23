import {
	AlignLeft,
	Calendar,
	CheckSquare,
	ChevronRight,
	Radio,
	Text,
	Upload,
} from 'lucide-react'
import { Modal } from '@/components/ui'

const FIELD_TYPES = [
	{ type: 'text', label: 'Short Text', icon: Text },
	{ type: 'textarea', label: 'Long Text', icon: AlignLeft },
	{ type: 'radio', label: 'Multiple Choice', icon: Radio },
	{ type: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
	{ type: 'date', label: 'Date', icon: Calendar },
	{ type: 'file', label: 'File Upload', icon: Upload },
]

interface AddFieldModalProps {
	open: boolean
	onClose: () => void
	onSelect?: (type: string) => void
}

function FieldCard({
	label,
	icon: Icon,
	active,
	onClick,
}: {
	label: string
	icon: typeof Text
	active?: boolean
	onClick: () => void
}) {
	return (
		<button
			onClick={onClick}
			className={[
				'flex flex-col items-center gap-3 rounded-xl border p-4 text-center transition-all',
				active
					? 'border-brand bg-brand-muted'
					: 'border-border bg-surface-secondary hover:border-brand-light hover:bg-brand-muted',
			].join(' ')}
		>
			<div className={[
				'flex h-10 w-10 items-center justify-center rounded-lg',
				active ? 'bg-brand text-white' : 'bg-surface text-brand',
			].join(' ')}>
				<Icon size={18} />
			</div>
			<p className={['text-[13px] font-medium', active ? 'text-brand' : 'text-text-primary'].join(' ')}>
				{label}
			</p>
		</button>
	)
}

export default function AddFieldModal({ open, onClose, onSelect }: AddFieldModalProps) {
	function handleSelect(type: string) {
		onSelect?.(type)
		onClose()
	}

	return (
		<Modal open={open} onClose={onClose} title="Add New Field">
			<div className="p-6">
				<div className="grid grid-cols-3 gap-3">
					{FIELD_TYPES.map(f => (
						<FieldCard
							key={f.type}
							label={f.label}
							icon={f.icon}
							onClick={() => handleSelect(f.type)}
						/>
					))}
				</div>

				<div className="mt-5 flex items-center justify-between rounded-xl bg-surface-secondary px-4 py-3">
					<p className="text-[12px] text-text-muted">
						Tip: You can drag and drop fields after adding.
					</p>
					<button className="flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline">
						More field types
						<ChevronRight size={13} />
					</button>
				</div>
			</div>
		</Modal>
	)
}
