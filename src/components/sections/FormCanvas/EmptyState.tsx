import { LayoutList, Plus } from 'lucide-react'

interface EmptyStateProps {
	onAdd: () => void
}

export default function EmptyState({ onAdd }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface py-16">
			<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted text-brand">
				<LayoutList size={24} />
			</div>
			<p className="mt-4 text-[15px] font-semibold text-text-primary">No fields yet</p>
			<p className="mt-1 text-[13px] text-text-muted">Add your first question to get started</p>
			<button
				onClick={onAdd}
				className="mt-5 flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-button transition-colors hover:bg-brand-dark"
			>
				<Plus size={14} />
				Add First Field
			</button>
		</div>
	)
}
