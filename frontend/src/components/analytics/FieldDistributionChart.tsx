import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { FieldDistribution } from '@/api/analytics'

const COLORS = [
  '#4e45e2', '#6a63ff', '#c084fc', '#f472b6',
  '#34d399', '#60a5fa', '#fbbf24', '#f87171',
]

interface Props {
  field: FieldDistribution
}

export function FieldDistributionChart({ field }: Props) {
  const total = field.options.reduce((s, o) => s + o.count, 0)
  if (total === 0) return (
    <div className="flex items-center justify-center py-8 text-[13px] text-text-muted">
      No responses yet for this field.
    </div>
  )

  const data = field.options
    .filter(o => o.count > 0)
    .map(o => ({ name: o.label, value: o.count }))

  return (
    <div>
      <p className="mb-1 text-[13px] font-semibold text-text-primary">{field.label}</p>
      <p className="mb-3 text-[11px] text-text-muted capitalize">{field.type} · {total} responses</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => [`${v} (${Math.round(v / total * 100)}%)`, 'Responses']}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
