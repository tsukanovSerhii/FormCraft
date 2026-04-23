import { Download, Eye } from 'lucide-react'
import { AppLayout } from '@/components/layouts'
import { Button, StarRating, StatCard } from '@/components/ui'
import { RESPONSES, RESPONSES_STATS } from '@/data/responses'

export default function ResponsesPage() {
	return (
		<AppLayout>
			<div className="px-8 py-8">
				{/* Header */}
				<div className="mb-6 flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-[22px] font-bold text-text-primary">Form Responses</h1>
							<span className="rounded-full bg-danger px-2.5 py-0.5 text-[11px] font-bold text-white">
								LIVE
							</span>
						</div>
						<p className="mt-0.5 text-[13px] text-text-muted">1,284 total submissions collected</p>
					</div>
					<div className="flex items-center gap-2">
						<div className="relative">
							<input
								type="text"
								placeholder="Search responses..."
								className="h-8 w-52 rounded-md border border-border bg-surface pl-8 pr-3 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none"
							/>
							<svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
							</svg>
						</div>
						<Button variant="outline" size="sm" icon={<Download size={13} />}>Export</Button>
					</div>
				</div>

				{/* Stats */}
				<div className="mb-6 grid grid-cols-3 gap-4">
					{RESPONSES_STATS.map(s => <StatCard key={s.label} {...s} uppercaseLabel />)}
				</div>

				{/* Table */}
				<div className="rounded-lg border border-border bg-surface shadow-card">
					<table className="w-full">
						<thead>
							<tr className="border-b border-border">
								{['DATE SUBMITTED', 'RESPONDENT', 'EMAIL ADDRESS', 'FEEDBACK SCORE', 'ACTIONS'].map(col => (
									<th key={col} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
										{col}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{RESPONSES.map((r, i) => (
								<tr key={r.id} className={i < RESPONSES.length - 1 ? 'border-b border-border' : ''}>
									<td className="px-5 py-4">
										<p className="text-[13px] font-medium text-text-primary">{r.date}</p>
										<p className="text-[12px] text-text-muted">{r.time}</p>
									</td>
									<td className="px-5 py-4">
										<div className="flex items-center gap-2.5">
											<span className={['flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold', r.color].join(' ')}>
												{r.initials}
											</span>
											<span className="text-[13px] font-medium text-text-primary">{r.name}</span>
										</div>
									</td>
									<td className="px-5 py-4 text-[13px] text-text-secondary">{r.email}</td>
									<td className="px-5 py-4"><StarRating score={r.score} /></td>
									<td className="px-5 py-4">
										<button className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary">
											<Eye size={15} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Pagination */}
					<div className="flex items-center justify-between border-t border-border px-5 py-3">
						<p className="text-[12px] text-text-muted">Showing 1-25 of 1,284 responses</p>
						<div className="flex items-center gap-1">
							{['‹', '1', '2', '3', '...', '52', '›'].map((p, i) => (
								<button
									key={i}
									className={[
										'flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-[13px] transition-colors',
										p === '1' ? 'bg-brand text-white' : 'text-text-secondary hover:bg-surface-secondary',
									].join(' ')}
								>
									{p}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
