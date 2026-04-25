import { SectionLabel, Input } from '@/components/ui'
import { useFormBuilderStore } from '@/store/formBuilderStore'

interface DateConfigProps {
	fieldId: string
	defaultValue?: string
}

export default function DateConfig({ fieldId, defaultValue }: DateConfigProps) {
	const { updateField } = useFormBuilderStore()

	return (
		<div className="flex flex-col gap-2">
			<SectionLabel>Default Date</SectionLabel>
			<Input
				type="date"
				value={defaultValue ?? ''}
				onChange={e => updateField(fieldId, { defaultValue: e.target.value })}
			/>
		</div>
	)
}
