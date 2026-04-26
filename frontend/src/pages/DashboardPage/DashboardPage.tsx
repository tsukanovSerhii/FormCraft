import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layouts'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import EmptyState from './EmptyState'
import FormCard from './FormCard'

export default function DashboardPage() {
	const navigate = useNavigate()
	const { forms, createForm, fetchForms } = useFormBuilderStore()

	useEffect(() => { fetchForms() }, [])

	async function handleNewForm() {
		const id = await createForm()
		navigate(`/builder/${id}`)
	}

	return (
		<AppLayout>
			<div className="px-8 py-7">
				<div className="mb-5 flex items-center justify-between">
					<h1 className="text-[17px] font-semibold text-text-primary">
						Forms
						{forms.length > 0 && (
							<span className="ml-2 text-[13px] font-normal text-text-muted">{forms.length}</span>
						)}
					</h1>
					{forms.length > 0 && (
						<button
							onClick={handleNewForm}
							className="flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
						>
							<Plus size={13} />
							New form
						</button>
					)}
				</div>

				{forms.length === 0 ? (
					<EmptyState onNew={handleNewForm} />
				) : (
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{forms.map(form => (
							<FormCard key={form.id} {...form} />
						))}
					</div>
				)}
			</div>
		</AppLayout>
	)
}
