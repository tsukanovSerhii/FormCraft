import { useEffect, useMemo, useRef, useState } from 'react'
import { DonutChart, LineChart } from '@/components/analytics'
import { AppLayout } from '@/components/layouts'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import { useResponsesStore } from '@/store/responsesStore'
import { formatRelativeDate } from '@/lib/utils'

const TIME_FILTERS = ['7 Days', '30 Days', 'Yearly'] as const
type TimeFilter = typeof TIME_FILTERS[number]

function filterDays(filter: TimeFilter) {
  if (filter === '7 Days') return 7
  if (filter === '30 Days') return 30
  return 365
}

function initials(title: string) {
  return title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30 Days')
  const { forms } = useFormBuilderStore()
  const { responses } = useResponsesStore()

  const days = filterDays(timeFilter)
  const nowRef = useRef(Date.now())
  useEffect(() => { nowRef.current = Date.now() }, [timeFilter])

  const filteredResponses = useMemo(
    () => {
      const cutoff = nowRef.current - days * 24 * 60 * 60 * 1000
      return responses.filter(r => r.submittedAt >= cutoff)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [responses, days]
  )

  const totalForms = forms.length
  const publishedForms = forms.filter(f => f.status === 'published').length
  const totalResponses = filteredResponses.length
  const completionRate = totalForms > 0 ? Math.round((publishedForms / totalForms) * 100) : 0
  const avgPerForm = totalForms > 0 ? Math.round(totalResponses / totalForms) : 0

  const topForms = useMemo(() => {
    return forms
      .map(f => ({
        name: f.title,
        responses: filteredResponses.filter(r => r.formId === f.id).length,
        status: f.status,
        updatedAt: f.updatedAt,
      }))
      .filter(f => f.responses > 0)
      .sort((a, b) => b.responses - a.responses)
      .slice(0, 5)
  }, [forms, filteredResponses])

  const recentActivity = useMemo(
    () => [...filteredResponses].sort((a, b) => b.submittedAt - a.submittedAt).slice(0, 8),
    [filteredResponses]
  )

  const chartPoints = useMemo(() => {
    const buckets: Record<string, number> = {}
    const slotCount = days <= 7 ? days : days <= 30 ? 10 : 12
    const snapshotNow = nowRef.current
    for (let i = slotCount - 1; i >= 0; i--) {
      const d = new Date(snapshotNow - i * (days / slotCount) * 24 * 60 * 60 * 1000)
      buckets[d.toLocaleDateString('en', { month: 'short', day: 'numeric' })] = 0
    }
    filteredResponses.forEach(r => {
      const key = new Date(r.submittedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })
      if (key in buckets) buckets[key]++
    })
    return Object.entries(buckets)
  }, [filteredResponses, days])

  return (
    <AppLayout>
      <div className="px-8 py-7">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[17px] font-semibold text-text-primary">Analytics</h1>
          <div className="flex rounded-md border border-border bg-surface p-0.5">
            {TIME_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={[
                  'rounded px-3 py-1 text-[12px] font-medium transition-colors',
                  f === timeFilter ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          {[
            { label: 'Total forms', value: totalForms, sub: `${publishedForms} published` },
            { label: 'Responses', value: totalResponses, sub: `Last ${days} days` },
            { label: 'Published rate', value: `${completionRate}%`, sub: 'of all forms' },
            { label: 'Avg per form', value: avgPerForm, sub: 'responses' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-surface px-5 py-4">
              <p className="text-[12px] text-text-muted">{s.label}</p>
              <p className="mt-1 text-[24px] font-bold text-text-primary leading-none">{s.value}</p>
              <p className="mt-1 text-[11px] text-text-muted">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mb-5 grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-xl border border-border bg-surface p-5">
            <p className="mb-1 text-[13px] font-semibold text-text-primary">Submissions over time</p>
            <p className="mb-4 text-[12px] text-text-muted">Last {days} days</p>
            {totalResponses === 0 ? (
              <div className="flex h-36 items-center justify-center text-[13px] text-text-muted">
                No responses in this period.
              </div>
            ) : (
              <LineChart points={chartPoints.map(([, v]) => v)} labels={chartPoints.map(([l]) => l)} />
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="mb-1 text-[13px] font-semibold text-text-primary">Published rate</p>
            <p className="mb-4 text-[12px] text-text-muted">Published vs draft</p>
            <DonutChart
              value={completionRate}
              centerLabel="Published"
              segments={[
                { label: 'Published', percentage: `${completionRate}%`, dotClass: 'bg-brand' },
                { label: 'Draft', percentage: `${100 - completionRate}%`, dotClass: 'bg-border' },
              ]}
            />
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <p className="text-[13px] font-semibold text-text-primary">Top forms</p>
              <span className="text-[12px] text-text-muted">{days}-day window</span>
            </div>
            {topForms.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-[13px] text-text-muted">
                No responses collected yet.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary/50">
                    {['Form', 'Responses', 'Status', 'Updated'].map(col => (
                      <th key={col} className="px-5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-muted">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topForms.map(f => (
                    <tr key={f.name} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="px-5 py-3 text-[13px] text-text-primary">{f.name}</td>
                      <td className="px-5 py-3 text-[13px] font-semibold text-text-primary">{f.responses}</td>
                      <td className="px-5 py-3">
                        <span className={[
                          'rounded-full px-2 py-0.5 text-[11px] font-medium',
                          f.status === 'published' ? 'bg-success-light text-success' : 'bg-surface-secondary text-text-muted',
                        ].join(' ')}>
                          {f.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-text-muted">{formatRelativeDate(f.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-3.5">
              <p className="text-[13px] font-semibold text-text-primary">Recent activity</p>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-[13px] text-text-muted">
                  No recent activity.
                </div>
              ) : recentActivity.map((r, i) => (
                <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                  <span className={[
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold',
                    i % 3 === 0 ? 'bg-brand-muted text-brand' : i % 3 === 1 ? 'bg-success-light text-success' : 'bg-danger-light text-danger',
                  ].join(' ')}>
                    {initials(r.formTitle)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-text-primary">{r.formTitle}</p>
                    <p className="text-[11px] text-text-muted">{formatRelativeDate(r.submittedAt)}</p>
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
