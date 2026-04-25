import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { Button } from '@/components/ui'
import AddFieldModal from '../AddFieldModal'
import { useActiveForm, useFormBuilderStore } from '@/store/formBuilderStore'
import AddFieldZone from './AddFieldZone'
import EmptyState from './EmptyState'
import FormHeader from './FormHeader'
import SortableFieldItem from './SortableFieldItem'

export default function FormCanvas() {
	const [modalOpen, setModalOpen] = useState(false)
	const form = useActiveForm()
	const { addField, reorderFields, selectedFieldId } = useFormBuilderStore()
	const fields = form?.fields ?? []
	const hasFields = fields.length > 0

	function handleAddField(type: string) {
		addField(type as Parameters<typeof addField>[0])
	}

	return (
		<DragDropProvider
			onDragEnd={({ operation }) => {
				const { source, target } = operation
				if (!source || !target || source.id === target.id) return
				const fromIndex = fields.findIndex(f => f.id === source.id)
				const toIndex = fields.findIndex(f => f.id === target.id)
				if (fromIndex !== -1 && toIndex !== -1) {
					reorderFields(fromIndex, toIndex)
				}
			}}
		>
			<div className="mx-auto flex max-w-170 flex-col gap-4">
				<FormHeader />

				{hasFields ? (
					<>
						{fields.map((field, index) => (
							<SortableFieldItem
								key={field.id}
								field={field}
								index={index}
								isSelected={selectedFieldId === field.id}
							/>
						))}
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

				<AddFieldModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onSelect={handleAddField}
				/>
			</div>
		</DragDropProvider>
	)
}
