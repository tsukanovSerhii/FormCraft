const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Cell({ value, max }: { value: number; max: number }) {
  const intensity = max === 0 ? 0 : value / max
  const alpha = 0.08 + intensity * 0.85
  return (
    <div
      title={`${value} responses`}
      className="h-6 w-full rounded-sm"
      style={{ background: `rgba(78,69,226,${alpha})` }}
    />
  )
}

export function HourHeatmap({ byHour }: { byHour: number[] }) {
  const max = Math.max(...byHour, 1)
  return (
    <div>
      <p className="mb-2 text-[12px] text-text-muted">Responses by hour of day</p>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
        {byHour.map((v, i) => <Cell key={i} value={v} max={max} />)}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-text-placeholder">
        <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
      </div>
    </div>
  )
}

export function DowHeatmap({ byDow }: { byDow: number[] }) {
  const max = Math.max(...byDow, 1)
  return (
    <div>
      <p className="mb-2 text-[12px] text-text-muted">Responses by day of week</p>
      <div className="grid grid-cols-7 gap-1">
        {byDow.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Cell value={v} max={max} />
            <span className="text-[10px] text-text-placeholder">{DAYS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
