import { type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export default function Textarea({ className, ...props }: TextareaProps) {
	return (
		<textarea
			className={cn(
				'w-full resize-none rounded-md border border-border bg-surface-secondary px-3 py-2 text-[13px] text-text-primary outline-none transition-colors placeholder:text-text-placeholder focus:border-brand',
				className,
			)}
			{...props}
		/>
	)
}
