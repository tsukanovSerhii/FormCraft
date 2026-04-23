import { Plus } from 'lucide-react'
import { AppLayout } from '@/components/layouts'
import { Button } from '@/components/ui'
import { MOCK_FORMS } from '@/data/dashboard'
import EmptyState from './EmptyState'
import FormCard from './FormCard'

export default function DashboardPage() {
	const isEmpty = MOCK_FORMS.length === 0

	return (
		<AppLayout>
			<div className="px-8 py-8">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="text-[22px] font-bold text-text-primary">Forms</h1>
						<p className="mt-0.5 text-[13px] text-text-muted">Manage and track all your forms</p>
					</div>
					{!isEmpty && (
						<Button variant="primary" size="sm" icon={<Plus size={14} />}>
							New Form
						</Button>
					)}
				</div>

				{isEmpty ? (
					<EmptyState onNew={() => {}} />
				) : (
					<>
						<div className="grid grid-cols-1 gap-3">
							{MOCK_FORMS.map(form => (
								<FormCard key={form.id} {...form} />
							))}
						</div>
						<p className="mt-6 text-center text-[12px] text-text-placeholder">
							Showing {MOCK_FORMS.length} forms
						</p>
					</>
				)}
			</div>
		</AppLayout>
	)
}
