import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import AddFieldModal from '../AddFieldModal'
import MultipleChoiceField from '../MultipleChoiceField'
import AddFieldZone from './AddFieldZone'
import EmptyState from './EmptyState'
import FormHeader from './FormHeader'

const HEARING_OPTIONS = ['Social Media', 'Friend Recommendation', 'Search Engine'] as const

const MOCK_FIELDS = ['multiple-choice', 'email'] as const

function EmailField() {
	return (
		<div className="rounded-lg border border-border bg-surface p-5 shadow-card">
			<p className="mb-3 text-[15px] font-medium text-text-primary">Email Address</p>
			<Input type="email" placeholder="Enter your email" className="bg-surface-tertiary" />
		</div>
	)
}

export default function FormCanvas() {
	const [modalOpen, setModalOpen] = useState(false)
	const hasFields = MOCK_FIELDS.length > 0

	return (
		<div className="mx-auto flex max-w-170 flex-col gap-4">
			<FormHeader />

			{hasFields ? (
				<>
					<MultipleChoiceField question="How did you hear about us?" options={[...HEARING_OPTIONS]} />
					<EmailField />
					<AddFieldZone onClick={() => setModalOpen(true)} />
					<Button
						variant="outline"
						className="h-11 w-full rounded-lg border-brand text-brand hover:bg-brand-muted"
						icon={<Plus size={16} />}
						onClick={() => setModalOpen(true)}
					>
						Add Question
					</Button>
				</>
			) : (
				<EmptyState onAdd={() => setModalOpen(true)} />
			)}

			<AddFieldModal open={modalOpen} onClose={() => setModalOpen(false)} />
		</div>
	)
}
