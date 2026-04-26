import { ChevronLeft, ChevronRight, Download, Eye, Inbox, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { responsesApi } from '@/api/responses'
import { AppLayout } from '@/components/layouts'
import ResponseModal from '@/components/ui/ResponseModal'
import { useSSE } from '@/hooks/useSSE'
import { useAuthStore } from '@/store/authStore'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import type { FormResponse } from '@/store/responsesStore'
import { useResponsesStore } from '@/store/responsesStore'

const PAGE_SIZE = 20

function formatDate(ts: number) {
	return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(ts)
}

function formatTime(ts: number) {
	return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', hour12: true }).format(ts)
}

function initials(title: string) {
	return title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function ResponsesPage() {
	const { responses, fetchResponses } = useResponsesStore()
	const { forms, fetchForms } = useFormBuilderStore()
	const { accessToken } = useAuthStore()

	const [search, setSearch] = useState('')
	const [formFilter, setFormFilter] = useState('all')
	const [dateFilter, setDateFilter] = useState('all')
	const [page, setPage] = useState(1)
	const [selected, setSelected] = useState<FormResponse | null>(null)
	const [exporting, setExporting] = useState(false)

	useEffect(() => { fetchForms() }, [])
	useEffect(() => { forms.forEach(f => fetchResponses(f.id, f.title)) }, [forms.length])

	useSSE((data) => {
		const payload = data as { type: string; notification: { meta?: { formId?: string } } }
		if (payload.type === 'notification' && payload.notification?.meta?.formId) {
			const formId = payload.notification.meta.formId
			const form = forms.find(f => f.id === formId)
			if (form) fetchResponses(formId, form.title)
		}
	})

	const filtered = useMemo(() => {
		const cutoff = dateFilter === '7d'
			? Date.now() - 7 * 86400_000
			: dateFilter === '30d'
				? Date.now() - 30 * 86400_000
				: 0

		return responses.filter(r => {
			if (formFilter !== 'all' && r.formId !== formFilter) return false
			if (cutoff && r.submittedAt < cutoff) return false
			if (search) {
				const q = search.toLowerCase()
				const inTitle = r.formTitle.toLowerCase().includes(q)
				const inData = Object.values(r.data).some(v => String(v).toLowerCase().includes(q))
				if (!inTitle && !inData) return false
			}
			return true
		})
	}, [responses, formFilter, dateFilter, search])

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

	function handleSearchChange(v: string) { setSearch(v); setPage(1) }
	function handleFormFilter(v: string) { setFormFilter(v); setPage(1) }
	function handleDateFilter(v: string) { setDateFilter(v); setPage(1) }

	async function handleExport() {
		if (!accessToken) return
		const formId = formFilter !== 'all' ? formFilter : undefined
		const form = forms.find(f => f.id === formId)
		setExporting(true)
		try {
			await responsesApi.exportCSV(
				formId ?? forms[0]?.id ?? '',
				form?.title ?? 'responses',
				accessToken,
			)
		} finally {
			setExporting(false)
		}
	}

	const uniqueForms = useMemo(() =>
		Array.from(new Map(responses.map(r => [r.formId, r.formTitle])).entries()),
		[responses]
	)

	const selectCls = 'h-8 rounded-md border border-border bg-surface px-2.5 text-[13px] text-text-primary focus:border-brand focus:outline-none'

	return (
		<AppLayout>
			<div className="px-8 py-7">
				{/* Header */}
				<div className="mb-5 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<h1 className="text-[17px] font-semibold text-text-primary">Responses</h1>
						{filtered.length > 0 && (
							<span className="rounded-full bg-brand-muted px-2 py-0.5 text-[11px] font-semibold text-brand">
								{filtered.length}
							</span>
						)}
					</div>
					<button
						onClick={handleExport}
						disabled={exporting || responses.length === 0}
						className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:opacity-40"
					>
						<Download size={13} />
						{exporting ? 'Exporting…' : 'Export CSV'}
					</button>
				</div>

				{/* Filters */}
				<div className="mb-4 flex flex-wrap items-center gap-2">
					<div className="relative">
						<Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
						<input
							value={search}
							onChange={e => handleSearchChange(e.target.value)}
							placeholder="Search…"
							className="h-8 w-44 rounded-md border border-border bg-surface pl-8 pr-3 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none"
						/>
					</div>
					<select value={formFilter} onChange={e => handleFormFilter(e.target.value)} className={selectCls}>
						<option value="all">All forms</option>
						{uniqueForms.map(([id, title]) => (
							<option key={id} value={id}>{title}</option>
						))}
					</select>
					<select value={dateFilter} onChange={e => handleDateFilter(e.target.value)} className={selectCls}>
						<option value="all">All time</option>
						<option value="7d">Last 7 days</option>
						<option value="30d">Last 30 days</option>
					</select>
				</div>

				{/* Empty state */}
				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-24 text-center">
						<div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-secondary text-text-muted">
							<Inbox size={20} />
						</div>
						<p className="text-[14px] font-semibold text-text-primary">
							{responses.length === 0 ? 'No responses yet' : 'No results found'}
						</p>
						<p className="mt-1 text-[13px] text-text-muted">
							{responses.length === 0
								? 'Share your form to start collecting responses.'
								: 'Try adjusting your search or filters.'}
						</p>
					</div>
				) : (
					<div className="overflow-hidden rounded-xl border border-border bg-surface">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border bg-surface-secondary/50">
									{['Date', 'Form', 'Preview', ''].map((col, i) => (
										<th key={i} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-text-muted">
											{col}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{paginated.map(r => (
									<tr key={r.id} className="group transition-colors hover:bg-surface-secondary/40">
										<td className="px-5 py-3.5 whitespace-nowrap">
											<p className="text-[13px] text-text-primary">{formatDate(r.submittedAt)}</p>
											<p className="text-[11px] text-text-muted">{formatTime(r.submittedAt)}</p>
										</td>
										<td className="px-5 py-3.5">
											<div className="flex items-center gap-2">
												<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-muted text-[10px] font-bold text-brand">
													{initials(r.formTitle)}
												</span>
												<span className="text-[13px] text-text-primary">{r.formTitle}</span>
											</div>
										</td>
										<td className="max-w-xs px-5 py-3.5">
											<p className="truncate text-[12px] text-text-muted">
												{Object.entries(r.data).slice(0, 2).map(([k, v]) => `${k}: ${String(v)}`).join(' · ')}
											</p>
										</td>
										<td className="px-5 py-3.5">
											<button
												onClick={() => setSelected(r)}
												className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted opacity-0 transition-all group-hover:opacity-100 hover:bg-surface-secondary hover:text-text-primary"
												title="View response"
											>
												<Eye size={14} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* Pagination */}
						<div className="flex items-center justify-between border-t border-border px-5 py-3">
							<p className="text-[12px] text-text-muted">
								{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
							</p>
							<div className="flex items-center gap-1">
								<button
									onClick={() => setPage(p => Math.max(1, p - 1))}
									disabled={page === 1}
									className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary disabled:opacity-30"
								>
									<ChevronLeft size={14} />
								</button>
								<span className="px-1.5 text-[12px] text-text-secondary">{page} / {totalPages}</span>
								<button
									onClick={() => setPage(p => Math.min(totalPages, p + 1))}
									disabled={page === totalPages}
									className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary disabled:opacity-30"
								>
									<ChevronRight size={14} />
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{selected && <ResponseModal response={selected} onClose={() => setSelected(null)} />}
		</AppLayout>
	)
}
