import type { ReactNode } from 'react'

interface FormSectionHeaderProps {
	icon: ReactNode
	title: string
}

export default function FormSectionHeader({ icon, title }: FormSectionHeaderProps) {
	return (
		<div className="mb-4 flex items-center gap-2.5">
			<div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-muted text-brand">
				{icon}
			</div>
			<h2 className="text-[15px] font-semibold text-text-primary">{title}</h2>
		</div>
	)
}
