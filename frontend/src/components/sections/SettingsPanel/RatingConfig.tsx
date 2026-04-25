import { SectionLabel } from '@/components/ui'
import { useFormBuilderStore } from '@/store/formBuilderStore'

const MAX_OPTIONS = [3, 5, 7, 10]

interface RatingConfigProps {
	fieldId: string
	ratingMax: number
}

export default function RatingConfig({ fieldId, ratingMax }: RatingConfigProps) {
	const { updateField } = useFormBuilderStore()

	return (
		<div className="flex flex-col gap-2">
			<SectionLabel>Max Rating</SectionLabel>
			<div className="flex gap-1.5">
				{MAX_OPTIONS.map(n => (
					<button
						key={n}
						onClick={() => updateField(fieldId, { ratingMax: n })}
						className={[
							'flex h-8 flex-1 items-center justify-center rounded-md border text-[13px] font-medium transition-colors',
							n === ratingMax
								? 'border-brand bg-brand-muted text-brand'
								: 'border-border text-text-secondary hover:border-brand-light',
						].join(' ')}
					>
						{n}
					</button>
				))}
			</div>
		</div>
	)
}
