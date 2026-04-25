import { Download, Eye, Inbox } from 'lucide-react'
import { AppLayout } from '@/components/layouts'
import { Button } from '@/components/ui'
import { useResponsesStore } from '@/store/responsesStore'

function formatDate(ts: number) {
	return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(ts)
}

function formatTime(ts: number) {
	return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', hour12: true }).format(ts)
}

function initials(formTitle: string) {
	return formTitle.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function ResponsesPage() {
	const { responses } = useResponsesStore()
	const total = responses.length

	return (
		<AppLayout>
			<div className="px-8 py-8">
				{/* Header */}
				<div className="mb-6 flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-[22px] font-bold text-text-primary">Form Responses</h1>
							{total > 0 && (
								<span className="rounded-full bg-danger px-2.5 py-0.5 text-[11px] font-bold text-white">
									LIVE
								</span>
							)}
						</div>
						<p className="mt-0.5 text-[13px] text-text-muted">
							{total} total submission{total !== 1 ? 's' : ''} collected
						</p>
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

				{/* Empty state */}
				{total === 0 ? (
					<div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface py-20">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted text-brand">
							<Inbox size={24} />
						</div>
						<p className="mt-4 text-[15px] font-semibold text-text-primary">No responses yet</p>
						<p className="mt-1 text-[13px] text-text-muted">Share your form to start collecting responses.</p>
					</div>
				) : (
					<div className="rounded-lg border border-border bg-surface shadow-card">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border">
									{['DATE SUBMITTED', 'FORM', 'RESPONSE ID', 'ACTIONS'].map(col => (
										<th key={col} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
											{col}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{responses.map((r, i) => (
									<tr key={r.id} className={i < responses.length - 1 ? 'border-b border-border' : ''}>
										<td className="px-5 py-4">
											<p className="text-[13px] font-medium text-text-primary">{formatDate(r.submittedAt)}</p>
											<p className="text-[12px] text-text-muted">{formatTime(r.submittedAt)}</p>
										</td>
										<td className="px-5 py-4">
											<div className="flex items-center gap-2.5">
												<span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-muted text-[11px] font-bold text-brand">
													{initials(r.formTitle)}
												</span>
												<span className="text-[13px] font-medium text-text-primary">{r.formTitle}</span>
											</div>
										</td>
										<td className="px-5 py-4 text-[13px] text-text-muted font-mono">{r.id}</td>
										<td className="px-5 py-4">
											<button className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary">
												<Eye size={15} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						<div className="flex items-center justify-between border-t border-border px-5 py-3">
							<p className="text-[12px] text-text-muted">Showing {total} response{total !== 1 ? 's' : ''}</p>
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	)
}
