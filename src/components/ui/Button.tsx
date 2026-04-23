import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	size?: ButtonSize
	icon?: ReactNode
	children?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: 'bg-brand text-white shadow-button hover:bg-brand-dark',
	outline: 'border border-border text-text-secondary hover:border-border-strong hover:text-text-primary',
	ghost:  'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
	danger: 'border border-danger-light bg-danger-light text-danger hover:bg-[#ffe0e3]',
}

const sizeClasses: Record<ButtonSize, string> = {
	sm: 'h-8 px-3 text-[13px]',
	md: 'h-9 px-4 text-[13px]',
}

export default function Button({
	variant = 'outline',
	size = 'md',
	icon,
	children,
	className,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				'inline-flex items-center justify-center gap-1.5 rounded-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
				variantClasses[variant],
				sizeClasses[size],
				className,
			)}
			{...props}
		>
			{icon}
			{children}
		</button>
	)
}
