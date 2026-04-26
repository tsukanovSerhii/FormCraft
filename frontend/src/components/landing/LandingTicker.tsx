import { DiamondIcon } from './LandingIcons'

const ITEMS = [
  'DRAG & DROP', 'INSTANT PUBLISH', 'CSV EXPORT', 'QR CODES',
  'VERSION HISTORY', 'CONDITIONAL LOGIC', 'LIVE RESPONSES',
  'PUBLIC FORMS', 'ANALYTICS', 'TEAM SHARING',
]
const repeated = [...ITEMS, ...ITEMS]

export function LandingTicker() {
  return (
    <div className="py-3.25 overflow-hidden border-t border-land-border border-b bg-land-bg2">
      <div
        className="flex w-max"
        style={{ animation: 'ticker 30s linear infinite' }}
        onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused')}
        onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'running')}
      >
        {repeated.map((item, i) => (
          <div key={i} className="flex items-center gap-7 pr-7 whitespace-nowrap">
            <span className="text-[11px] font-bold tracking-[1.8px] text-land-text3">{item}</span>
            <DiamondIcon />
          </div>
        ))}
      </div>
    </div>
  )
}
