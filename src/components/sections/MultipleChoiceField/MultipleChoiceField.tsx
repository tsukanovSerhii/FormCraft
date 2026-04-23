import { Trash2 } from 'lucide-react'
import { useMultipleChoice } from './useMultipleChoice'

interface MultipleChoiceFieldProps {
	question: string
	options: string[]
}

export default function MultipleChoiceField({
	question,
	options
}: MultipleChoiceFieldProps) {
	const { selected, toggle } = useMultipleChoice()

	return (
		<div className="rounded-lg border border-border bg-surface p-5 shadow-card">
			<div className="mb-4 flex items-start justify-between">
				<p className="text-[15px] font-medium text-text-primary">{question}</p>
				<button className="flex h-7 w-7 items-center justify-center rounded-sm text-text-muted transition-colors hover:bg-danger-light hover:text-danger">
					<Trash2 size={14} />
				</button>
			</div>

			<div className="flex flex-col gap-2">
				{options.map(option => {
					const isSelected = selected === option
					return (
						<label
							key={option}
							className={[
								'flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 transition-colors',
								isSelected
									? 'border-brand bg-brand-muted'
									: 'border-border bg-surface hover:border-brand-light hover:bg-brand-muted/40'
							].join(' ')}
							onClick={() => toggle(option)}
						>
							<span
								className={[
									'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
									isSelected ? 'border-brand' : 'border-border-strong'
								].join(' ')}
							>
								{isSelected && (
									<span className="h-2 w-2 rounded-full bg-brand" />
								)}
							</span>
							<span
								className={[
									'text-[14px] transition-colors',
									isSelected ? 'font-medium text-brand' : 'text-text-secondary'
								].join(' ')}
							>
								{option}
							</span>
						</label>
					)
				})}
			</div>
		</div>
	)
}
