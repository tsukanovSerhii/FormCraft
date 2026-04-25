import { useState } from 'react'

interface LineChartProps {
  points?: number[]
  labels?: string[]
}

const CHART_W = 600
const CHART_H = 160
const PAD_L = 36
const PAD_B = 24
const PAD_T = 12
const PAD_R = 12

const W = CHART_W - PAD_L - PAD_R
const H = CHART_H - PAD_T - PAD_B

export default function LineChart({ points = [], labels = [] }: LineChartProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const maxVal = Math.max(...points, 1)
  const n = Math.max(points.length - 1, 1)

  function px(i: number) { return PAD_L + (i / n) * W }
  function py(v: number) { return PAD_T + H - (v / maxVal) * H }

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(p).toFixed(1)}`).join(' ')
  const fillPath = linePath + ` L ${px(points.length - 1).toFixed(1)} ${(PAD_T + H).toFixed(1)} L ${PAD_L} ${(PAD_T + H).toFixed(1)} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(maxVal * f))

  // which labels to show (max 6)
  const step = Math.ceil(labels.length / 6)
  const visibleLabelIdxs = new Set(labels.map((_, i) => i).filter(i => i % step === 0 || i === labels.length - 1))

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="h-36 w-full"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="lcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y grid lines + labels */}
        {yTicks.map(v => {
          const y = py(v)
          return (
            <g key={v}>
              <line x1={PAD_L} y1={y} x2={CHART_W - PAD_R} y2={y}
                stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
              <text x={PAD_L - 6} y={y + 4} textAnchor="end"
                fontSize="10" fill="currentColor" fillOpacity="0.4">{v}</text>
            </g>
          )
        })}

        {/* Fill */}
        {points.length > 1 && <path d={fillPath} fill="url(#lcGrad)" />}

        {/* Line */}
        {points.length > 1 && (
          <path d={linePath} fill="none" stroke="#6c63ff" strokeWidth="2.5"
            strokeLinejoin="round" strokeLinecap="round" />
        )}

        {/* X labels */}
        {labels.map((label, i) => visibleLabelIdxs.has(i) && (
          <text key={i} x={px(i)} y={CHART_H - 4} textAnchor="middle"
            fontSize="10" fill="currentColor" fillOpacity="0.45">{label}</text>
        ))}

        {/* Hover targets + dots */}
        {points.map((v, i) => (
          <g key={i}>
            <rect
              x={px(i) - (W / n) / 2} y={PAD_T}
              width={W / n} height={H}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
            />
            {hovered === i && (
              <>
                <line x1={px(i)} y1={PAD_T} x2={px(i)} y2={PAD_T + H}
                  stroke="#6c63ff" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
                <circle cx={px(i)} cy={py(v)} r="5" fill="#6c63ff" />
                <circle cx={px(i)} cy={py(v)} r="3" fill="white" />
                {/* tooltip box */}
                <rect x={px(i) - 22} y={py(v) - 26} width="44" height="20"
                  rx="4" fill="#6c63ff" />
                <text x={px(i)} y={py(v) - 12} textAnchor="middle"
                  fontSize="11" fontWeight="bold" fill="white">{v}</text>
              </>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
