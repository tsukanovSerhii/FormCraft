import { DragIcon, ChartIcon, PublishIcon, CsvIcon, GlobeIcon, HistoryIcon } from './LandingIcons'

const FIELD_TAGS = ['Short text', 'Email', 'Rating', 'Dropdown', 'Checkbox', 'Date']

function BentoIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 border"
      style={{
        background: 'linear-gradient(135deg,rgba(106,99,255,.15),rgba(78,69,226,.08))',
        borderColor: 'rgba(106,99,255,.15)',
      }}
    >
      {children}
    </div>
  )
}

function GradNum({ children }: { children: string }) {
  return (
    <div
      className="font-black text-[64px] leading-none mt-auto"
      style={{
        fontFamily: 'Manrope,sans-serif',
        letterSpacing: '-3px',
        background: 'linear-gradient(135deg,#8b85ff,#6a63ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </div>
  )
}

function BentoTitle({ children }: { children: string }) {
  return <div className="font-bold text-[18px] text-land-text mb-2" style={{ fontFamily: 'Manrope,sans-serif' }}>{children}</div>
}

function BentoDesc({ children }: { children: string }) {
  return <div className="text-[14px] text-land-text2 leading-[1.65]">{children}</div>
}

const card = 'bg-land-bg2 rounded-[20px] border border-land-border p-8 transition-all duration-200 hover:border-land-border2 hover:-translate-y-0.5'

export function LandingFeatures() {
  return (
    <section id="features-grid" className="bg-land-bg">
      <div className="max-w-300 mx-auto px-10 py-24">
        <div className="text-center mb-16">
          <div className="text-[12px] font-bold tracking-[2px] text-land-accent uppercase mb-3.5">What's inside</div>
          <h2 className="font-extrabold text-land-text" style={{ fontFamily: 'Manrope,sans-serif', fontSize: 'clamp(28px,3vw,42px)', letterSpacing: '-1.5px' }}>
            Everything you need.<br />Nothing you don't.
          </h2>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          {/* Wide — Drag & drop */}
          <div className={`${card} col-span-2`}>
            <BentoIcon><DragIcon /></BentoIcon>
            <BentoTitle>Drag & drop builder</BentoTitle>
            <BentoDesc>11 field types. Reorder in seconds. Set labels, validation and conditional logic — all inline. No code, ever.</BentoDesc>
            <div className="mt-6 bg-land-bg3 rounded-[12px] p-4 flex gap-2 flex-wrap">
              {FIELD_TAGS.map(f => (
                <div key={f} className="px-3 py-1.5 bg-land-bg2 rounded-lg text-[12px] font-semibold text-land-text2 border border-land-border whitespace-nowrap">
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Live responses */}
          <div className={`${card} flex flex-col`}>
            <BentoIcon><ChartIcon /></BentoIcon>
            <BentoTitle>Live response feed</BentoTitle>
            <BentoDesc>Submissions appear instantly.</BentoDesc>
            <GradNum>∞</GradNum>
          </div>

          {/* One-click publish */}
          <div className={`${card} flex flex-col`}>
            <BentoIcon><PublishIcon /></BentoIcon>
            <BentoTitle>One-click publish</BentoTitle>
            <BentoDesc>Share via link, QR code, or iframe.</BentoDesc>
            <GradNum>2m</GradNum>
          </div>

          {/* CSV export */}
          <div className={card}>
            <BentoIcon><CsvIcon /></BentoIcon>
            <BentoTitle>CSV export</BentoTitle>
            <BentoDesc>Your data. Your format. One button to download everything collected.</BentoDesc>
          </div>

          {/* Public forms */}
          <div className={card}>
            <BentoIcon><GlobeIcon /></BentoIcon>
            <BentoTitle>Public forms</BentoTitle>
            <BentoDesc>Respondents need zero accounts. Share anywhere and collect everywhere.</BentoDesc>
          </div>

          {/* Version history */}
          <div className={card}>
            <BentoIcon><HistoryIcon /></BentoIcon>
            <BentoTitle>Version history</BentoTitle>
            <BentoDesc>Restore any past snapshot of a form. Undo without fear.</BentoDesc>
          </div>
        </div>
      </div>
    </section>
  )
}
