import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionLabelProps {
	children: ReactNode
	className?: string
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
	return (
		<p className={cn('text-[11px] font-semibold uppercase tracking-wider text-text-muted', className)}>
			{children}
		</p>
	)
}
