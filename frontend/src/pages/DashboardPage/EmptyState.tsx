import { FileText, Plus } from 'lucide-react'

interface EmptyStateProps {
	onNew: () => void
}

export default function EmptyState({ onNew }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface py-20">
			<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-muted text-brand">
				<FileText size={28} />
			</div>
			<p className="mt-5 text-[17px] font-bold text-text-primary">No forms yet</p>
			<p className="mt-1.5 max-w-xs text-center text-[13px] text-text-muted">
				Create your first form to start collecting responses from your audience.
			</p>
			<button
				onClick={onNew}
				className="mt-6 flex items-center gap-1.5 rounded-lg bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-button transition-colors hover:bg-brand-dark"
			>
				<Plus size={14} />
				Create your first form
			</button>
		</div>
	)
}
