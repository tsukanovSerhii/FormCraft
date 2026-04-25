interface Segment {
  label: string
  percentage: string
  dotClass: string
}

interface DonutChartProps {
  value: number
  centerLabel: string
  segments: Segment[]
}

export default function DonutChart({ value, centerLabel, segments }: DonutChartProps) {
  const r = 40
  const cx = 56
  const cy = 56
  const full = 2 * Math.PI * r
  const filled = full * (value / 100)

  return (
    <div className="flex items-center gap-6">
      <svg width="112" height="112" viewBox="0 0 112 112" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="currentColor" strokeOpacity="0.12" strokeWidth="14" />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#6c63ff"
          strokeWidth="14"
          strokeDasharray={`${filled} ${full - filled}`}
          strokeDashoffset={full * 0.25}
          strokeLinecap="round"
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="15"
          fontWeight="bold" fill="currentColor">{value}%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="10"
          fill="currentColor" fillOpacity="0.5">{centerLabel}</text>
      </svg>
      <div className="flex flex-col gap-2">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={['h-2.5 w-2.5 rounded-full', s.dotClass].join(' ')} />
            <span className="text-[12px] text-text-secondary">{s.label}</span>
            <span className="ml-1 text-[12px] font-semibold text-text-primary">{s.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
