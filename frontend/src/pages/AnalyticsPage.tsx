import { BarChart2, Calendar, CheckCircle2, Loader2, TrendingUp, Users2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { analyticsApi, type FormAnalytics } from '@/api/analytics'
import { DonutChart } from '@/components/analytics'
import { SubmissionsChart } from '@/components/analytics/SubmissionsChart'
import { HourHeatmap, DowHeatmap } from '@/components/analytics/HeatmapChart'
import { FieldDistributionChart } from '@/components/analytics/FieldDistributionChart'
import { TopFormsTable } from '@/components/analytics/TopFormsTable'
import { RecentActivity } from '@/components/analytics/RecentActivity'
import { AppLayout } from '@/components/layouts'
import { StatCard } from '@/components/ui'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import { useResponsesStore } from '@/store/responsesStore'

const TIME_FILTERS = ['7 Days', '30 Days', 'Yearly'] as const
type TimeFilter = typeof TIME_FILTERS[number]

function filterDays(filter: TimeFilter) {
  if (filter === '7 Days') return 7
  if (filter === '30 Days') return 30
  return 365
}

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30 Days')
  const [selectedFormId, setSelectedFormId] = useState<string>('all')
  const [formAnalytics, setFormAnalytics] = useState<FormAnalytics | null>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  const { forms } = useFormBuilderStore()
  const { responses } = useResponsesStore()

  const days = filterDays(timeFilter)
  const nowRef = useRef(Date.now())
  useEffect(() => { nowRef.current = Date.now() }, [timeFilter])

  // Load per-form analytics when a specific form is selected
  useEffect(() => {
    if (selectedFormId === 'all') { setFormAnalytics(null); return }
    setLoadingAnalytics(true)
    analyticsApi.getFormAnalytics(selectedFormId, days)
      .then(setFormAnalytics)
      .catch(() => setFormAnalytics(null))
      .finally(() => setLoadingAnalytics(false))
  }, [selectedFormId, days])

  const filteredResponses = useMemo(() => {
    const cutoff = nowRef.current - days * 24 * 60 * 60 * 1000
    return responses.filter(r => r.submittedAt >= cutoff)
  }, [responses, days])

  const totalForms = forms.length
  const publishedForms = forms.filter(f => f.status === 'published').length
  const totalResponses = filteredResponses.length
  const completionRate = totalForms > 0 ? Math.round((publishedForms / totalForms) * 100) : 0
  const abandonedRate = 100 - completionRate

  const stats = [
    { label: 'Total Forms', value: String(totalForms), delta: `${publishedForms} published`, deltaType: 'up' as const, icon: BarChart2 },
    { label: 'Total Responses', value: String(totalResponses), delta: `Last ${days} days`, deltaType: 'up' as const, icon: Users2 },
    { label: 'Completion Rate', value: `${completionRate}%`, delta: 'Published forms', deltaType: completionRate >= 50 ? 'up' as const : 'down' as const, icon: CheckCircle2 },
    { label: 'Avg per Form', value: totalForms > 0 ? String(Math.round(totalResponses / totalForms)) : '0', delta: 'responses / form', deltaType: 'up' as const, icon: TrendingUp },
  ]

  const topForms = useMemo(() => forms
    .map(f => ({
      name: f.title,
      responses: filteredResponses.filter(r => r.formId === f.id).length,
      status: f.status,
      updatedAt: f.updatedAt,
    }))
    .filter(f => f.responses > 0)
    .sort((a, b) => b.responses - a.responses)
    .slice(0, 5),
    [forms, filteredResponses]
  )

  const recentActivity = useMemo(
    () => [...filteredResponses].sort((a, b) => b.submittedAt - a.submittedAt).slice(0, 8),
    [filteredResponses]
  )

  // Overview chart data
  const overviewByDay = useMemo(() => {
    const buckets: Record<string, number> = {}
    const slotCount = days <= 7 ? days : days <= 30 ? 10 : 12
    const snap = nowRef.current
    for (let i = slotCount - 1; i >= 0; i--) {
      const d = new Date(snap - i * (days / slotCount) * 24 * 60 * 60 * 1000)
      buckets[d.toISOString().slice(0, 10)] = 0
    }
    filteredResponses.forEach(r => {
      const key = new Date(r.submittedAt).toISOString().slice(0, 10)
      if (key in buckets) buckets[key]++
    })
    return buckets
  }, [filteredResponses, days])

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
            {/* Form selector */}
            <select
              value={selectedFormId}
              onChange={e => setSelectedFormId(e.target.value)}
              className="h-8 rounded-md border border-border bg-surface px-2.5 text-[13px] text-text-primary focus:border-brand focus:outline-none"
            >
              <option value="all">All forms</option>
              {forms.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
            </select>

            {/* Time filter */}
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

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Overview charts */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-lg border border-border bg-surface p-5 shadow-card">
            <div className="mb-4">
              <p className="text-[14px] font-semibold text-text-primary">Form Submissions Over Time</p>
              <p className="text-[12px] text-text-muted">Daily aggregation · last {days} days</p>
            </div>
            <SubmissionsChart byDay={overviewByDay} />
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

        {/* Per-form deep analytics */}
        {selectedFormId !== 'all' && (
          <div className="mb-6">
            {loadingAnalytics ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={20} className="animate-spin text-text-muted" />
              </div>
            ) : formAnalytics ? (
              <div className="flex flex-col gap-4">
                {/* Heatmaps */}
                <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
                  <p className="mb-4 text-[14px] font-semibold text-text-primary">
                    Response Heatmap — {formAnalytics.formTitle}
                  </p>
                  <div className="flex flex-col gap-6">
                    <HourHeatmap byHour={formAnalytics.byHour} />
                    <DowHeatmap byDow={formAnalytics.byDow} />
                  </div>
                </div>

                {/* Field distribution */}
                {formAnalytics.fieldDistribution.length > 0 && (
                  <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
                    <p className="mb-4 text-[14px] font-semibold text-text-primary">Field-level Distribution</p>
                    <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                      {formAnalytics.fieldDistribution.map(field => (
                        <FieldDistributionChart key={field.fieldId} field={field} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <TopFormsTable forms={topForms} days={days} />
          </div>
          <RecentActivity responses={recentActivity} />
        </div>
      </div>
    </AppLayout>
  )
}
