import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'brand' | 'muted'

interface BadgeProps {
	children: ReactNode
	variant?: BadgeVariant
	className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
	brand: 'bg-brand-muted text-brand',
	muted: 'bg-surface-tertiary text-text-muted',
}

export default function Badge({ children, variant = 'brand', className }: BadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold',
				variantClasses[variant],
				className,
			)}
		>
			{children}
		</span>
	)
}
