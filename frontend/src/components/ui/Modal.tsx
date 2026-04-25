import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
	open: boolean
	onClose: () => void
	title?: string
	children: ReactNode
	className?: string
}

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
	useEffect(() => {
		if (!open) return
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [open, onClose])

	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-text-primary/30 backdrop-blur-[2px]"
				onClick={onClose}
			/>

			{/* Panel */}
			<div className={cn('relative z-10 w-full max-w-lg rounded-2xl bg-surface shadow-panel', className)}>
				{title && (
					<div className="flex items-center justify-between border-b border-border px-6 py-4">
						<h2 className="text-[15px] font-semibold text-text-primary">{title}</h2>
						<button
							onClick={onClose}
							className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
						>
							<X size={15} />
						</button>
					</div>
				)}
				{children}
			</div>
		</div>
	)
}
