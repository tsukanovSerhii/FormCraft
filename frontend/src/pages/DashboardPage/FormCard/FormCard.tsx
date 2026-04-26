import { formatRelativeDate } from '@/lib/utils'
import type { Form } from '@/types/form'
import DropdownMenu from './DropdownMenu'
import StatusBadge from './StatusBadge'
import { useFormCard } from '@/hooks'

export default function FormCard({ id, title, responses, updatedAt, status }: Form) {
	const { handleEdit, handleDuplicate, handleDelete } = useFormCard(id)

	return (
		<div
			onClick={handleEdit}
			className="group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-border bg-surface p-5 transition-all hover:border-brand/30 hover:shadow-panel"
		>
			{/* Icon + menu row */}
			<div className="flex items-start justify-between">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-muted">
					<svg width="15" height="15" viewBox="0 0 16 16" fill="none">
						<rect x="2" y="2" width="12" height="2" rx="1" fill="#6c63ff" />
						<rect x="2" y="6" width="8" height="2" rx="1" fill="#6c63ff" fillOpacity="0.5" />
						<rect x="2" y="10" width="10" height="2" rx="1" fill="#6c63ff" fillOpacity="0.5" />
					</svg>
				</div>
				<div onClick={e => e.stopPropagation()}>
					<DropdownMenu onEdit={handleEdit} onDuplicate={handleDuplicate} onDelete={handleDelete} />
				</div>
			</div>

			{/* Title */}
			<div>
				<p className="text-[14px] font-semibold text-text-primary leading-snug">{title}</p>
				<p className="mt-1 text-[12px] text-text-muted">
					Updated {formatRelativeDate(updatedAt)}
				</p>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between">
				<span className="text-[12px] text-text-secondary">
					<span className="font-semibold text-text-primary">{responses}</span> responses
				</span>
				<StatusBadge status={status} />
			</div>
		</div>
	)
}
