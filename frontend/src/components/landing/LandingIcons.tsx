type SvgProps = { size?: number; color?: string }

function Svg({ size = 24, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

export function ArrowRightIcon({ size = 16, color = 'currentColor' }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  )
}

export function ZapIcon({ size = 14, color = '#8b85ff' }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

export function StarIcon({ size = 15, color = '#f59e0b' }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function DiamondIcon({ size = 6, color = '#6a63ff' }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 6 6" fill={color}>
      <polygon points="3,0 6,3 3,6 0,3" opacity="0.5" />
    </svg>
  )
}

export function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="0" y="0" width="13" height="13" rx="3" fill="#6a63ff" />
      <rect x="9" y="9" width="13" height="13" rx="3" fill="#4e45e2" opacity=".7" />
    </svg>
  )
}

export function DragIcon({ size = 22 }: SvgProps) {
  return (
    <Svg size={size}>
      <path d="M12 2v20" stroke="#8b85ff" />
      <path d="M2 12h20" stroke="#8b85ff" />
      <path d="M7 7l5-5 5 5" stroke="#8b85ff" />
      <path d="M7 17l5 5 5-5" stroke="#8b85ff" />
    </Svg>
  )
}

export function ChartIcon({ size = 22 }: SvgProps) {
  return (
    <Svg size={size}>
      <path d="M18 20V10" stroke="#8b85ff" />
      <path d="M12 20V4" stroke="#8b85ff" />
      <path d="M6 20v-6" stroke="#8b85ff" />
    </Svg>
  )
}

export function PublishIcon({ size = 22 }: SvgProps) {
  return (
    <Svg size={size}>
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="#8b85ff" />
      <path d="M16 6l-4-4-4 4" stroke="#8b85ff" />
      <path d="M12 2v15" stroke="#8b85ff" />
    </Svg>
  )
}

export function CsvIcon({ size = 22 }: SvgProps) {
  return (
    <Svg size={size}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#8b85ff" />
      <path d="M14 2v6h6" stroke="#8b85ff" />
      <path d="M16 13H8" stroke="#8b85ff" />
      <path d="M16 17H8" stroke="#8b85ff" />
      <path d="M10 9H8" stroke="#8b85ff" />
    </Svg>
  )
}

export function GlobeIcon({ size = 22 }: SvgProps) {
  return (
    <Svg size={size}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#8b85ff" />
      <path d="M2 12h20" stroke="#8b85ff" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" stroke="#8b85ff" />
    </Svg>
  )
}

export function HistoryIcon({ size = 22 }: SvgProps) {
  return (
    <Svg size={size}>
      <path d="M1 4v6h6" stroke="#8b85ff" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke="#8b85ff" />
    </Svg>
  )
}
