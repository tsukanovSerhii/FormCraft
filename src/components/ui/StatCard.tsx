import type { LucideIcon } from 'lucide-react'

export interface StatCardProps {
	label: string
	value: string
	delta: string
	deltaType: 'up' | 'down' | 'neutral'
	icon: LucideIcon
	uppercaseLabel?: boolean
}

export default function StatCard({ label, value, delta, deltaType, icon: Icon, uppercaseLabel = false }: StatCardProps) {
	return (
		<div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-card">
			<div className="flex items-start justify-between">
				<div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-muted text-brand">
					<Icon size={16} />
				</div>
				<span className={[
					'rounded-full px-2 py-0.5 text-[11px] font-semibold',
					deltaType === 'up' ? 'bg-success-light text-success'
					: deltaType === 'down' ? 'bg-danger-light text-danger'
					: 'bg-brand-muted text-brand',
				].join(' ')}>
					{delta}
				</span>
			</div>
			<div>
				<p className={['text-text-muted', uppercaseLabel ? 'text-[11px] font-semibold uppercase tracking-wider' : 'text-[13px]'].join(' ')}>
					{label}
				</p>
				<p className="mt-0.5 text-[26px] font-bold leading-none text-text-primary">{value}</p>
			</div>
		</div>
	)
}
