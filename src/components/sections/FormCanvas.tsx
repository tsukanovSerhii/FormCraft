import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import AddFieldModal from './AddFieldModal'
import MultipleChoiceField from './MultipleChoiceField'

const HEARING_OPTIONS = ['Social Media', 'Friend Recommendation', 'Search Engine'] as const

function EmailField() {
	return (
		<div className="rounded-lg border border-border bg-surface p-5 shadow-card">
			<p className="mb-3 text-[15px] font-medium text-text-primary">
				Email Address
			</p>
			<Input type="email" placeholder="Enter your email" className="bg-surface-tertiary" />
		</div>
	)
}

function AddFieldZone({ onClick }: { onClick: () => void }) {
	return (
		<button
			onClick={onClick}
			className="group flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-surface-secondary p-8 transition-colors hover:border-brand"
		>
			<span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border-strong text-text-muted transition-colors group-hover:border-brand group-hover:text-brand">
				<Plus size={18} />
			</span>
			<p className="text-[13px] text-text-muted transition-colors group-hover:text-brand">
				Click to add a new field
			</p>
		</button>
	)
}

export default function FormCanvas() {
	const [modalOpen, setModalOpen] = useState(false)

	return (
		<div className="mx-auto flex max-w-170 flex-col gap-4">
			<div className="rounded-lg border border-border bg-surface p-6 shadow-card">
				<div className="border-l-4 border-brand pl-4">
					<h1 className="text-[22px] font-bold text-text-primary">
						Untitled Form
					</h1>
					<p className="mt-1 text-[14px] text-text-placeholder">
						Form description (optional)
					</p>
				</div>
			</div>

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

			<AddFieldModal open={modalOpen} onClose={() => setModalOpen(false)} />
		</div>
	)
}
