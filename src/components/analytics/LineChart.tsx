const POINTS = [30, 45, 35, 60, 55, 70, 65, 80, 72, 90, 85, 95]
const X_LABELS = ['Oct 01', 'Oct 07', 'Oct 14', 'Oct 21', 'Oct 28', 'Nov 01']
const H = 140
const W = 100 / (POINTS.length - 1)

function toY(v: number) {
	return H - (v / 100) * H
}

const linePath = POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * W} ${toY(p)}`).join(' ')
const fillPath = linePath + ` L ${(POINTS.length - 1) * W} ${H} L 0 ${H} Z`

export default function LineChart() {
	return (
		<div className="relative h-36 w-full">
			<svg viewBox={`0 0 ${(POINTS.length - 1) * W} ${H}`} className="h-full w-full" preserveAspectRatio="none">
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
				{X_LABELS.map(label => (
					<span key={label}>{label}</span>
				))}
			</div>
		</div>
	)
}
