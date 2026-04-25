import { Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface DropdownMenuProps {
	onEdit: () => void
	onDuplicate: () => void
	onDelete: () => void
}

export default function DropdownMenu({ onEdit, onDuplicate, onDelete }: DropdownMenuProps) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function handler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [])

	return (
		<div ref={ref} className="relative">
			<button
				onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
				className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
			>
				<MoreHorizontal size={15} />
			</button>
			{open && (
				<div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-border bg-surface py-1 shadow-panel">
					<button
						onClick={() => { setOpen(false); onEdit() }}
						className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-text-primary hover:bg-surface-secondary"
					>
						<Pencil size={13} /> Edit
					</button>
					<button
						onClick={() => { setOpen(false); onDuplicate() }}
						className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-text-primary hover:bg-surface-secondary"
					>
						<Copy size={13} /> Duplicate
					</button>
					<div className="my-1 border-t border-border" />
					<button
						onClick={() => { setOpen(false); onDelete() }}
						className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-error hover:bg-surface-secondary"
					>
						<Trash2 size={13} /> Delete
					</button>
				</div>
			)}
		</div>
	)
}
