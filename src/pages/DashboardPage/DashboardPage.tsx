import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layouts'
import { Button } from '@/components/ui'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import EmptyState from './EmptyState'
import FormCard from './FormCard'

export default function DashboardPage() {
	const navigate = useNavigate()
	const { forms, createForm } = useFormBuilderStore()

	function handleNewForm() {
		const id = createForm()
		navigate(`/builder/${id}`)
	}

	const isEmpty = forms.length === 0

	return (
		<AppLayout>
			<div className="px-8 py-8">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="text-[22px] font-bold text-text-primary">Forms</h1>
						<p className="mt-0.5 text-[13px] text-text-muted">Manage and track all your forms</p>
					</div>
					{!isEmpty && (
						<Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={handleNewForm}>
							New Form
						</Button>
					)}
				</div>

				{isEmpty ? (
					<EmptyState onNew={handleNewForm} />
				) : (
					<>
						<div className="grid grid-cols-1 gap-3">
							{forms.map(form => (
								<FormCard key={form.id} {...form} />
							))}
						</div>
						<p className="mt-6 text-center text-[12px] text-text-placeholder">
							Showing {forms.length} form{forms.length !== 1 ? 's' : ''}
						</p>
					</>
				)}
			</div>
		</AppLayout>
	)
}
