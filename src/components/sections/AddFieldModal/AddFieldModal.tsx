import { useState } from 'react'
import {
	AlignLeft,
	Calendar,
	ChevronRight,
	Hash,
	List,
	Mail,
	Phone,
	Radio,
	SquareCheckBig,
	Star,
	Text,
	Upload,
} from 'lucide-react'
import { Modal } from '@/components/ui'

const PRIMARY_FIELDS = [
	{ type: 'text',     label: 'Short Text',      icon: Text },
	{ type: 'textarea', label: 'Long Text',        icon: AlignLeft },
	{ type: 'radio',    label: 'Multiple Choice',  icon: Radio },
	{ type: 'checkbox', label: 'Checkboxes',       icon: SquareCheckBig },
	{ type: 'date',     label: 'Date',             icon: Calendar },
	{ type: 'file',     label: 'File Upload',      icon: Upload },
]

const MORE_FIELDS = [
	{ type: 'email',    label: 'Email',    icon: Mail },
	{ type: 'number',   label: 'Number',   icon: Hash },
	{ type: 'select',   label: 'Dropdown', icon: List },
	{ type: 'rating',   label: 'Rating',   icon: Star },
	{ type: 'phone',    label: 'Phone',    icon: Phone },
]

interface AddFieldModalProps {
	open: boolean
	onClose: () => void
	onSelect?: (type: string) => void
}

function FieldCard({
	label,
	icon: Icon,
	onClick,
}: {
	label: string
	icon: typeof Text
	onClick: () => void
}) {
	return (
		<button
			onClick={onClick}
			className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface-secondary p-4 text-center transition-all hover:border-brand-light hover:bg-brand-muted"
		>
			<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-brand">
				<Icon size={18} />
			</div>
			<p className="text-[13px] font-medium text-text-primary">{label}</p>
		</button>
	)
}

export default function AddFieldModal({ open, onClose, onSelect }: AddFieldModalProps) {
	const [showMore, setShowMore] = useState(false)

	function handleSelect(type: string) {
		onSelect?.(type)
		onClose()
		setShowMore(false)
	}

	function handleClose() {
		onClose()
		setShowMore(false)
	}

	return (
		<Modal open={open} onClose={handleClose} title="Add New Field">
			<div className="p-6">
				{/* Primary grid */}
				<div className="grid grid-cols-3 gap-3">
					{PRIMARY_FIELDS.map(f => (
						<FieldCard key={f.type} label={f.label} icon={f.icon} onClick={() => handleSelect(f.type)} />
					))}
				</div>

				{/* More field types — expandable */}
				{showMore && (
					<div className="mt-3 grid grid-cols-3 gap-3 border-t border-border pt-3">
						{MORE_FIELDS.map(f => (
							<FieldCard key={f.type} label={f.label} icon={f.icon} onClick={() => handleSelect(f.type)} />
						))}
					</div>
				)}

				{/* Footer */}
				<div className="mt-5 flex items-center justify-between rounded-xl bg-surface-secondary px-4 py-3">
					<p className="text-[12px] text-text-muted">
						Tip: You can drag and drop fields after adding.
					</p>
					<button
						onClick={() => setShowMore(v => !v)}
						className="flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline"
					>
						{showMore ? 'Hide field types' : 'More field types'}
						<ChevronRight
							size={13}
							className={['transition-transform', showMore ? 'rotate-90' : ''].join(' ')}
						/>
					</button>
				</div>
			</div>
		</Modal>
	)
}
