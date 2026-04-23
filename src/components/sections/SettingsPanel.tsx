import { Copy, Eye, GripVertical, Trash2, X } from 'lucide-react'
import { Badge, Button, Input, SectionLabel, Textarea, Toggle } from '@/components/ui'

const options = ['Social Media', 'Friend Recommendation', 'Search Engine']

export default function SettingsPanel() {
	return (
		<div className="flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-border px-4 py-3">
				<SectionLabel>Settings</SectionLabel>
				<Badge>Multiple Choice</Badge>
			</div>

			<div className="flex flex-col gap-5 p-4">
				{/* Field label */}
				<div className="flex flex-col gap-2">
					<SectionLabel>Field Label</SectionLabel>
					<Input defaultValue="How did you hear about us?" />
				</div>

				{/* Required toggle */}
				<div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
					<div>
						<p className="text-[13px] font-medium text-text-primary">Required</p>
						<p className="text-[11px] text-text-muted">Mandatory for submission</p>
					</div>
					<Toggle checked />
				</div>

				{/* Options */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<SectionLabel>Options</SectionLabel>
						<button className="text-[11px] font-semibold text-brand hover:underline">
							+ Add Option
						</button>
					</div>

					<div className="flex flex-col gap-1.5">
						{options.map(option => (
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

				{/* Help text */}
				<div className="flex flex-col gap-2">
					<SectionLabel>Help Text</SectionLabel>
					<Textarea placeholder="Add instructions for users..." rows={3} />
				</div>
			</div>

			{/* Actions */}
			<div className="mt-auto flex gap-2 border-t border-border p-4">
				<Button variant="outline" className="flex-1" icon={<Copy size={13} />}>
					Duplicate
				</Button>
				<Button variant="danger" className="flex-1" icon={<Trash2 size={13} />}>
					Delete
				</Button>
			</div>

			{/* Preview mode hint */}
			<div className="mx-4 mb-4 flex items-center gap-2 rounded-md bg-text-primary px-3 py-2.5">
				<Eye size={14} className="shrink-0 text-white opacity-70" />
				<div className="min-w-0">
					<p className="text-[11px] font-semibold uppercase tracking-wider text-white opacity-60">
						Preview Mode
					</p>
					<p className="text-[12px] font-medium text-white">Everything looks good!</p>
				</div>
			</div>
		</div>
	)
}
