import { Calendar } from 'lucide-react'
import { DonutChart, LineChart } from '@/components/analytics'
import { AppLayout } from '@/components/layouts'
import { StatCard } from '@/components/ui'
import { ANALYTICS_STATS, RECENT_ACTIVITY, TOP_FORMS } from '@/data/analytics'

const TIME_FILTERS = ['7 Days', '30 Days', 'Yearly']

export default function AnalyticsPage() {
	return (
		<AppLayout>
			<div className="px-8 py-8">
				{/* Header */}
				<div className="mb-6 flex items-start justify-between">
					<div>
						<h1 className="text-[22px] font-bold text-text-primary">Analytics</h1>
						<p className="mt-0.5 text-[13px] text-text-muted">Performance insights across your digital forms.</p>
					</div>
					<div className="flex items-center gap-2">
						<div className="flex rounded-md border border-border bg-surface p-0.5">
							{TIME_FILTERS.map(f => (
								<button
									key={f}
									className={[
										'rounded px-3 py-1 text-[13px] font-medium transition-colors',
										f === '30 Days' ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary',
									].join(' ')}
								>
									{f}
								</button>
							))}
						</div>
						<button className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:border-border-strong hover:text-text-primary">
							<Calendar size={14} />
						</button>
					</div>
				</div>

				{/* Stat cards */}
				<div className="mb-6 grid grid-cols-4 gap-4">
					{ANALYTICS_STATS.map(s => <StatCard key={s.label} {...s} />)}
				</div>

				{/* Charts row */}
				<div className="mb-6 grid grid-cols-3 gap-4">
					<div className="col-span-2 rounded-lg border border-border bg-surface p-5 shadow-card">
						<div className="mb-4 flex items-start justify-between">
							<div>
								<p className="text-[14px] font-semibold text-text-primary">Form Submissions Over Time</p>
								<p className="text-[12px] text-text-muted">Daily aggregation across all active forms</p>
							</div>
							<button className="text-text-muted hover:text-text-primary">
								<svg width="16" height="4" viewBox="0 0 16 4" fill="currentColor">
									<circle cx="2" cy="2" r="1.5" /><circle cx="8" cy="2" r="1.5" /><circle cx="14" cy="2" r="1.5" />
								</svg>
							</button>
						</div>
						<LineChart />
					</div>

					<div className="rounded-lg border border-border bg-surface p-5 shadow-card">
						<div className="mb-4">
							<p className="text-[14px] font-semibold text-text-primary">Completion Rate</p>
							<p className="text-[12px] text-text-muted">Overall submission efficiency</p>
						</div>
						<DonutChart
							value={76.4}
							centerLabel="Completed"
							segments={[
								{ label: 'Full Submission', percentage: '76.4%', dotClass: 'bg-brand' },
								{ label: 'Abandoned', percentage: '23.6%', dotClass: 'bg-border' },
							]}
						/>
					</div>
				</div>

				{/* Bottom row */}
				<div className="grid grid-cols-3 gap-4">
					{/* Top performing forms */}
					<div className="col-span-2 rounded-lg border border-border bg-surface shadow-card">
						<div className="flex items-center justify-between border-b border-border px-5 py-3.5">
							<p className="text-[14px] font-semibold text-text-primary">Top-performing Forms</p>
							<button className="text-[12px] font-semibold text-brand hover:underline">View All</button>
						</div>
						<table className="w-full">
							<thead>
								<tr className="border-b border-border">
									{['FORM NAME', 'RESPONSES', 'RATE', 'LAST UPDATED'].map(col => (
										<th key={col} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
											{col}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{TOP_FORMS.map((f, i) => (
									<tr key={f.name} className={i < TOP_FORMS.length - 1 ? 'border-b border-border' : ''}>
										<td className="px-5 py-3.5 text-[13px] font-medium text-text-primary">{f.name}</td>
										<td className="px-5 py-3.5 text-[13px] text-text-secondary">{f.responses.toLocaleString()}</td>
										<td className="px-5 py-3.5">
											<span className="rounded-full bg-success-light px-2 py-0.5 text-[11px] font-semibold text-success">{f.rate}</span>
										</td>
										<td className="px-5 py-3.5 text-[12px] text-text-muted">{f.updated}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Recent activity */}
					<div className="rounded-lg border border-border bg-surface shadow-card">
						<div className="border-b border-border px-5 py-3.5">
							<p className="text-[14px] font-semibold text-text-primary">Recent Activity</p>
						</div>
						<div className="flex flex-col">
							{RECENT_ACTIVITY.map((a, i) => (
								<div key={i} className={['flex items-start gap-3 px-5 py-3.5', i < RECENT_ACTIVITY.length - 1 ? 'border-b border-border' : ''].join(' ')}>
									<span className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', a.color].join(' ')}>
										{a.initials}
									</span>
									<div>
										<p className="text-[13px] font-medium text-text-primary">{a.name}</p>
										<p className="text-[12px] text-text-muted">{a.action}</p>
										<p className="mt-0.5 text-[11px] text-text-placeholder">{a.time}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
