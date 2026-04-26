import { Plus } from 'lucide-react'

interface EmptyStateProps {
	onNew: () => void
}

export default function EmptyState({ onNew }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-24 text-center">
			<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-muted">
				<svg width="20" height="20" viewBox="0 0 16 16" fill="none">
					<rect x="2" y="2" width="12" height="2" rx="1" fill="#6c63ff" />
					<rect x="2" y="6" width="8" height="2" rx="1" fill="#6c63ff" fillOpacity="0.5" />
					<rect x="2" y="10" width="10" height="2" rx="1" fill="#6c63ff" fillOpacity="0.5" />
				</svg>
			</div>
			<p className="text-[15px] font-semibold text-text-primary">No forms yet</p>
			<p className="mt-1.5 max-w-60 text-[13px] text-text-muted">
				Create your first form and start collecting responses.
			</p>
			<button
				onClick={onNew}
				className="mt-6 flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
			>
				<Plus size={13} />
				New form
			</button>
		</div>
	)
}
