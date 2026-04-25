import { BarChart2, Calendar, CheckCircle2, TrendingUp, Users2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DonutChart, LineChart } from '@/components/analytics'
import { AppLayout } from '@/components/layouts'
import { StatCard } from '@/components/ui'
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

const AVATAR_COLORS = [
  'bg-brand-muted text-brand',
  'bg-success-light text-success',
  'bg-danger-light text-danger',
]

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30 Days')
  const { forms } = useFormBuilderStore()
  const { responses } = useResponsesStore()

  const days = filterDays(timeFilter)
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

  const filteredResponses = useMemo(
    () => responses.filter(r => r.submittedAt >= cutoff),
    [responses, cutoff]
  )

  const totalForms = forms.length
  const publishedForms = forms.filter(f => f.status === 'published').length
  const totalResponses = filteredResponses.length
  const completionRate = totalForms > 0
    ? Math.round((publishedForms / totalForms) * 100)
    : 0

  const stats = [
    { label: 'Total Forms', value: String(totalForms), delta: `${publishedForms} published`, deltaType: 'up' as const, icon: BarChart2 },
    { label: 'Total Responses', value: String(totalResponses), delta: `Last ${days} days`, deltaType: 'up' as const, icon: Users2 },
    { label: 'Completion Rate', value: `${completionRate}%`, delta: 'Published forms', deltaType: completionRate >= 50 ? 'up' as const : 'down' as const, icon: CheckCircle2 },
    { label: 'Avg per Form', value: totalForms > 0 ? String(Math.round(totalResponses / totalForms)) : '0', delta: 'responses / form', deltaType: 'up' as const, icon: TrendingUp },
  ]

  // Top forms by response count
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

  // Recent activity — last 8 responses
  const recentActivity = useMemo(
    () => [...filteredResponses].sort((a, b) => b.submittedAt - a.submittedAt).slice(0, 8),
    [filteredResponses]
  )

  // Chart data — responses per day (last N days)
  const chartPoints = useMemo(() => {
    const buckets: Record<string, number> = {}
    const slotCount = days <= 7 ? days : days <= 30 ? 10 : 12
    for (let i = slotCount - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * (days / slotCount) * 24 * 60 * 60 * 1000)
      buckets[d.toLocaleDateString('en', { month: 'short', day: 'numeric' })] = 0
    }
    filteredResponses.forEach(r => {
      const key = new Date(r.submittedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })
      if (key in buckets) buckets[key]++
    })
    return Object.entries(buckets)
  }, [filteredResponses, days])

  const abandonedRate = 100 - completionRate

  return (
    <AppLayout>
      <div className="px-8 py-8">
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
                  onClick={() => setTimeFilter(f)}
                  className={[
                    'rounded px-3 py-1 text-[13px] font-medium transition-colors',
                    f === timeFilter ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary',
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

        <div className="mb-6 grid grid-cols-4 gap-4">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-lg border border-border bg-surface p-5 shadow-card">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[14px] font-semibold text-text-primary">Form Submissions Over Time</p>
                <p className="text-[12px] text-text-muted">Daily aggregation · last {days} days</p>
              </div>
            </div>
            {totalResponses === 0 ? (
              <div className="flex h-36 items-center justify-center text-[13px] text-text-muted">
                No responses yet in this period.
              </div>
            ) : (
              <LineChart points={chartPoints.map(([, v]) => v)} labels={chartPoints.map(([l]) => l)} />
            )}
          </div>

          <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
            <div className="mb-4">
              <p className="text-[14px] font-semibold text-text-primary">Published Rate</p>
              <p className="text-[12px] text-text-muted">Forms published vs draft</p>
            </div>
            <DonutChart
              value={completionRate}
              centerLabel="Published"
              segments={[
                { label: 'Published', percentage: `${completionRate}%`, dotClass: 'bg-brand' },
                { label: 'Draft', percentage: `${abandonedRate}%`, dotClass: 'bg-border' },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-lg border border-border bg-surface shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <p className="text-[14px] font-semibold text-text-primary">Top-performing Forms</p>
              <span className="text-[12px] text-text-muted">{days}-day window</span>
            </div>
            {topForms.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-[13px] text-text-muted">
                No responses collected yet.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['FORM NAME', 'RESPONSES', 'STATUS', 'LAST UPDATED'].map(col => (
                      <th key={col} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topForms.map((f, i) => (
                    <tr key={f.name} className={i < topForms.length - 1 ? 'border-b border-border' : ''}>
                      <td className="px-5 py-3.5 text-[13px] font-medium text-text-primary">{f.name}</td>
                      <td className="px-5 py-3.5 text-[13px] text-text-secondary">{f.responses}</td>
                      <td className="px-5 py-3.5">
                        <span className={[
                          'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                          f.status === 'published' ? 'bg-success-light text-success' : 'bg-surface-secondary text-text-muted',
                        ].join(' ')}>
                          {f.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-text-muted">{formatRelativeDate(f.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="rounded-lg border border-border bg-surface shadow-card">
            <div className="border-b border-border px-5 py-3.5">
              <p className="text-[14px] font-semibold text-text-primary">Recent Activity</p>
            </div>
            <div className="flex flex-col">
              {recentActivity.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-[13px] text-text-muted">
                  No recent activity.
                </div>
              ) : recentActivity.map((r, i) => (
                <div key={r.id} className={['flex items-start gap-3 px-5 py-3.5', i < recentActivity.length - 1 ? 'border-b border-border' : ''].join(' ')}>
                  <span className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', AVATAR_COLORS[i % AVATAR_COLORS.length]].join(' ')}>
                    {initials(r.formTitle)}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">{r.formTitle}</p>
                    <p className="text-[12px] text-text-muted">New response submitted</p>
                    <p className="mt-0.5 text-[11px] text-text-placeholder">{formatRelativeDate(r.submittedAt)}</p>
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
