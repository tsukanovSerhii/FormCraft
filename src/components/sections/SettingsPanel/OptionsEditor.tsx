import { GripVertical, X } from 'lucide-react'
import { SectionLabel } from '@/components/ui'

const DEFAULT_OPTIONS = ['Social Media', 'Friend Recommendation', 'Search Engine']

export default function OptionsEditor() {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<SectionLabel>Options</SectionLabel>
				<button className="text-[11px] font-semibold text-brand hover:underline">
					+ Add Option
				</button>
			</div>
			<div className="flex flex-col gap-1.5">
				{DEFAULT_OPTIONS.map(option => (
					<div
						key={option}
						className="flex items-center gap-2 rounded-md border border-border bg-surface-secondary px-2 py-1.5"
					>
						<GripVertical size={13} className="shrink-0 cursor-grab text-text-muted" />
						<input
							type="text"
							defaultValue={option}
							className="min-w-0 flex-1 bg-transparent text-[13px] text-text-primary outline-none"
						/>
						<button className="shrink-0 text-text-muted transition-colors hover:text-danger">
							<X size={13} />
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
