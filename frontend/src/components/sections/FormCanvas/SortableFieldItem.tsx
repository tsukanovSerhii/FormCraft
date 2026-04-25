import { useSortable } from '@dnd-kit/react/sortable'
import type { FormField } from '@/types/form'
import FieldItem from './FieldItem'

interface SortableFieldItemProps {
	field: FormField
	index: number
	isSelected: boolean
}

export default function SortableFieldItem({ field, index, isSelected }: SortableFieldItemProps) {
	const { ref, isDragging } = useSortable({ id: field.id, index, group: 'fields' })

	return (
		<div
			ref={ref}
			style={{ opacity: isDragging ? 0.4 : 1, transition: 'opacity 150ms' }}
		>
			<FieldItem field={field} isSelected={isSelected} />
		</div>
	)
}
