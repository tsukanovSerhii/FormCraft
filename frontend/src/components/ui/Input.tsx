import { type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export default function Input({ className, ...props }: InputProps) {
	return (
		<input
			className={cn(
				'w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-[13px] text-text-primary outline-none transition-colors placeholder:text-text-placeholder focus:border-brand',
				className,
			)}
			{...props}
		/>
	)
}
