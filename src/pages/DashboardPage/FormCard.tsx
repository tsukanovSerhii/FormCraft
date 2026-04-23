import { MoreHorizontal } from 'lucide-react'

interface FormCardProps {
	title: string
	responses: number
	updatedAt: string
	status: 'published' | 'draft'
}

function StatusBadge({ status }: { status: 'published' | 'draft' }) {
	return (
		<span className={[
			'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
			status === 'published' ? 'bg-success-light text-success' : 'bg-surface-tertiary text-text-muted',
		].join(' ')}>
			{status === 'published' ? 'Published' : 'Draft'}
		</span>
	)
}

export default function FormCard({ title, responses, updatedAt, status }: FormCardProps) {
	return (
		<div className="flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 shadow-card transition-shadow hover:shadow-panel">
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
						{responses} responses · Updated {updatedAt}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<StatusBadge status={status} />
				<button className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary">
					<MoreHorizontal size={15} />
				</button>
			</div>
		</div>
	)
}
