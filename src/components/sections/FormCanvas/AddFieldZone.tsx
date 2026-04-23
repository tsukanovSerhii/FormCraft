import { Plus } from 'lucide-react'

interface AddFieldZoneProps {
	onClick: () => void
}

export default function AddFieldZone({ onClick }: AddFieldZoneProps) {
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
