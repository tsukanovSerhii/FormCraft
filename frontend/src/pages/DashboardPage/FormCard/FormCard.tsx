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
			className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 shadow-card transition-shadow hover:shadow-panel"
		>
			<div className="flex items-center gap-4">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-muted">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<rect x="2" y="2" width="12" height="2" rx="1" fill="#6c63ff" />
						<rect x="2" y="6" width="8" height="2" rx="1" fill="#6c63ff" fillOpacity="0.5" />
						<rect x="2" y="10" width="10" height="2" rx="1" fill="#6c63ff" fillOpacity="0.5" />
					</svg>
				</div>
				<div>
					<p className="text-[14px] font-medium text-text-primary">{title}</p>
					<p className="mt-0.5 text-[12px] text-text-muted">
						{responses} responses · Updated {formatRelativeDate(updatedAt)}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
				<StatusBadge status={status} />
				<DropdownMenu onEdit={handleEdit} onDuplicate={handleDuplicate} onDelete={handleDelete} />
			</div>
		</div>
	)
}
