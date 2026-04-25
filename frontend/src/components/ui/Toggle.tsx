import { cn } from '@/lib/utils'

interface ToggleProps {
	checked?: boolean
	onChange?: (checked: boolean) => void
	className?: string
}

export default function Toggle({
	checked = false,
	onChange,
	className
}: ToggleProps) {
	return (
		<button
			role="switch"
			aria-checked={checked}
			onClick={() => onChange?.(!checked)}
			className={cn(
				'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
				checked ? 'bg-toggle-on' : 'bg-toggle-off',
				className
			)}
		>
			<span
				className={cn(
					'absolute h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform',
					checked ? 'translate-x-4.5' : 'translate-x-0.75'
				)}
			/>
		</button>
	)
}
