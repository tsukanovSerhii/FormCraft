import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface Props {
  byDay: Record<string, number>
  days: number
}

export function SubmissionsChart({ byDay, days }: Props) {
  const data = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      count,
    }))

  if (data.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center text-[13px] text-text-muted">
        No responses yet in this period.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4e45e2" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#4e45e2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#4e45e2"
          strokeWidth={2}
          fill="url(#grad)"
          name="Responses"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
