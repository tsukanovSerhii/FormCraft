import { useNavigate } from 'react-router-dom'
import { useFormBuilderStore } from '@/store/formBuilderStore'

export function useFormCard(id: string) {
	const navigate = useNavigate()
	const { deleteForm, duplicateForm, setActiveForm } = useFormBuilderStore()

	function handleEdit() {
		setActiveForm(id)
		navigate(`/builder/${id}`)
	}

	return {
		handleEdit,
		handleDuplicate: () => duplicateForm(id),
		handleDelete: () => deleteForm(id),
	}
}
