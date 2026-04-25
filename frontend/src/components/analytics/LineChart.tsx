const H = 140
const DEFAULT_POINTS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

interface LineChartProps {
  points?: number[]
  labels?: string[]
}

export default function LineChart({ points = DEFAULT_POINTS, labels = [] }: LineChartProps) {
  const W = 100 / Math.max(points.length - 1, 1)

  function toY(v: number) {
    return H - (v / 100) * H
  }

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * W} ${toY(p)}`).join(' ')
  const fillPath = linePath + ` L ${(points.length - 1) * W} ${H} L 0 ${H} Z`

  const visibleLabels = labels.length > 6
    ? labels.filter((_, i) => i === 0 || i === labels.length - 1 || i % Math.ceil(labels.length / 5) === 0)
    : labels

  return (
    <div className="relative h-36 w-full">
      <svg viewBox={`0 0 ${(points.length - 1) * W} ${H}`} className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill="url(#lineChartGrad)" />
        <path d={linePath} fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-text-muted">
        {visibleLabels.map(label => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}
