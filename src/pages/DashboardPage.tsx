import { MoreHorizontal, Plus } from 'lucide-react'
import { AppLayout } from '@/components/layouts'
import { Button } from '@/components/ui'
import { MOCK_FORMS } from '@/data/dashboard'

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

export default function DashboardPage() {
	return (
		<AppLayout>
			<div className="px-8 py-8">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="text-[22px] font-bold text-text-primary">Forms</h1>
						<p className="mt-0.5 text-[13px] text-text-muted">Manage and track all your forms</p>
					</div>
					<Button variant="primary" size="sm" icon={<Plus size={14} />}>
						New Form
					</Button>
				</div>

				{/* Forms list */}
				<div className="grid grid-cols-1 gap-3">
					{MOCK_FORMS.map(form => (
						<div
							key={form.id}
							className="flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 shadow-card transition-shadow hover:shadow-panel"
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
									<p className="text-[14px] font-medium text-text-primary">{form.title}</p>
									<p className="mt-0.5 text-[12px] text-text-muted">
										{form.responses} responses · Updated {form.updatedAt}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<StatusBadge status={form.status} />
								<button className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary">
									<MoreHorizontal size={15} />
								</button>
							</div>
						</div>
					))}
				</div>

				<p className="mt-6 text-center text-[12px] text-text-placeholder">
					Showing {MOCK_FORMS.length} forms
				</p>
			</div>
		</AppLayout>
	)
}
