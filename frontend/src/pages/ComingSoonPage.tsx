import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'
import { AppLayout } from '@/components/layouts'

interface ComingSoonPageProps {
	title: string
	description: string
	icon?: LucideIcon
}

export default function ComingSoonPage({ title, description, icon: Icon = Construction }: ComingSoonPageProps) {
	return (
		<AppLayout>
			<div className="flex flex-1 flex-col items-center justify-center px-8 py-24">
				<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-muted text-brand">
					<Icon size={28} />
				</div>
				<h1 className="mt-5 text-[22px] font-bold text-text-primary">{title}</h1>
				<p className="mt-2 max-w-sm text-center text-[14px] text-text-muted">{description}</p>
				<div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
					<span className="h-2 w-2 rounded-full bg-brand" />
					<span className="text-[13px] font-medium text-text-secondary">Coming Soon</span>
				</div>
			</div>
		</AppLayout>
	)
}
