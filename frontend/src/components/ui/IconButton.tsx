import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode
}

export default function IconButton({ children, className, ...props }: IconButtonProps) {
	return (
		<button
			className={cn(
				'flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	)
}
