import { Download, Inbox } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { responsesApi } from '@/api/responses'
import { AppLayout } from '@/components/layouts'
import { Button } from '@/components/ui'
import ResponseModal from '@/components/ui/ResponseModal'
import { ResponsesFilters } from '@/components/responses/ResponsesFilters'
import { ResponsesTable } from '@/components/responses/ResponsesTable'
import { ResponsesPagination } from '@/components/responses/ResponsesPagination'
import { useAuthStore } from '@/store/authStore'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import type { FormResponse } from '@/store/responsesStore'
import { useResponsesStore } from '@/store/responsesStore'

const PAGE_SIZE = 20

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

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => { fetchForms() }, [])
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => { forms.forEach(f => fetchResponses(f.id, f.title)) }, [forms.length])

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

	const uniqueForms = useMemo(
		() => Array.from(new Map(responses.map(r => [r.formId, r.formTitle])).entries())
			.map(([id, title]) => ({ id, title })),
		[responses]
	)

	function handleSearch(v: string) { setSearch(v); setPage(1) }
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

	return (
		<AppLayout>
			<div className="px-8 py-8">
				<div className="mb-6 flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-[22px] font-bold text-text-primary">Responses</h1>
							{filtered.length > 0 && (
								<span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white">
									{filtered.length}
								</span>
							)}
						</div>
						<p className="mt-0.5 text-[13px] text-text-muted">
							{responses.length} total submission{responses.length !== 1 ? 's' : ''} collected
						</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						icon={<Download size={13} />}
						onClick={handleExport}
						disabled={exporting || responses.length === 0}
					>
						{exporting ? 'Exporting…' : 'Export CSV'}
					</Button>
				</div>

				<ResponsesFilters
					search={search}
					formFilter={formFilter}
					dateFilter={dateFilter}
					uniqueForms={uniqueForms}
					onSearch={handleSearch}
					onFormFilter={handleFormFilter}
					onDateFilter={handleDateFilter}
				/>

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface py-20">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted text-brand">
							<Inbox size={24} />
						</div>
						<p className="mt-4 text-[15px] font-semibold text-text-primary">
							{responses.length === 0 ? 'No responses yet' : 'No results found'}
						</p>
						<p className="mt-1 text-[13px] text-text-muted">
							{responses.length === 0
								? 'Share your form to start collecting responses.'
								: 'Try adjusting your search or filters.'}
						</p>
					</div>
				) : (
					<div>
						<ResponsesTable rows={paginated} onView={setSelected} />
						<ResponsesPagination
							page={page}
							totalPages={totalPages}
							totalCount={filtered.length}
							pageSize={PAGE_SIZE}
							onPage={setPage}
						/>
					</div>
				)}
			</div>

			{selected && <ResponseModal response={selected} onClose={() => setSelected(null)} />}
		</AppLayout>
	)
}
