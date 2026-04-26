import { ArrowRightIcon, ZapIcon } from './LandingIcons'

const STATS = [
  { n: '11', l: 'Field types' },
  { n: '∞',  l: 'Forms, free' },
  { n: '0',  l: 'Lines of code' },
  { n: '2m', l: 'To first live form' },
]

const RATINGS = ['Poor', 'Average', 'Great', 'Exceptional']

export function LandingHero({ onCTA }: { onCTA: () => void }) {
  return (
    <section id="features" className="min-h-screen flex items-center relative overflow-hidden pt-17 bg-land-bg">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%,black 40%,transparent 100%)',
        }}
      />
      {/* Orbs */}
      <div className="absolute w-175 h-175 rounded-full pointer-events-none -top-50 -left-37.5"
        style={{ background: 'radial-gradient(circle,rgba(106,99,255,.18) 0%,transparent 65%)', animation: 'float1 10s ease-in-out infinite' }} />
      <div className="absolute w-125 h-125 rounded-full pointer-events-none -bottom-25 -right-20"
        style={{ background: 'radial-gradient(circle,rgba(110,59,216,.14) 0%,transparent 65%)', animation: 'float2 13s ease-in-out infinite' }} />

      <div className="max-w-300 mx-auto px-10 py-20 w-full grid grid-cols-[1fr_440px] gap-20 items-center relative z-1">
        {/* Left */}
        <div>
          <h1
            className="fade-up fu1 font-black leading-none text-land-text mb-7"
            style={{ fontFamily: 'Manrope,sans-serif', fontSize: 'clamp(48px,5.5vw,76px)', letterSpacing: '-3px' }}
          >
            Forms that<br />
            <span style={{ background: 'linear-gradient(135deg,#8b85ff 0%,#6a63ff 50%,#c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              actually work.
            </span>
          </h1>

          <p className="fade-up fu2 text-[18px] leading-[1.7] text-land-text2 max-w-90 mb-11">
            Drag. Drop. Publish. Watch responses roll in.<br />
            No code, no friction — just a form builder<br />
            that gets out of your way.
          </p>

          <div className="fade-up fu3 flex gap-3.5 flex-wrap">
            <button
              onClick={onCTA}
              className="flex items-center gap-2 px-8.5 py-3.75 rounded-lg text-[17px] font-bold text-[#fbf7ff] transition-all hover:-translate-y-px active:translate-y-0"
              style={{ background: 'linear-gradient(135deg,#4e45e2 0%,#6a63ff 100%)', boxShadow: '0 4px 20px rgba(106,99,255,0.25)' }}
            >
              Start for free <ArrowRightIcon size={16} />
            </button>
            <button
              onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-3 rounded-3 text-[15px] font-semibold text-land-text bg-land-bg3 border border-land-border2 transition-all hover:-translate-y-px hover:bg-land-bg2"
            >
              View demo
            </button>
          </div>

          {/* Stats */}
          <div className="fade-up fu4 flex gap-10 mt-12 pt-10 border-t border-land-border">
            {STATS.map(({ n, l }) => (
              <div key={l}>
                <div
                  className="font-black text-[32px] leading-none"
                  style={{ fontFamily: 'Manrope,sans-serif', letterSpacing: '-1.5px', background: 'linear-gradient(135deg,#8b85ff,#6a63ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  {n}
                </div>
                <div className="text-[13px] text-land-text3 mt-0.5 font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero card */}
        <div
          className="fade-up fu2 relative rounded-5 border border-land-border2 overflow-visible bg-land-bg2"
          style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset,0 16px 40px rgba(0,0,0,0.4)' }}
        >
          <div className="h-1.25 rounded-t-5" style={{ background: 'linear-gradient(90deg,#4e45e2,#6a63ff,#c084fc)' }} />
          <div className="h-10.5 flex items-center gap-1.75 px-4 border-b border-land-border">
            {['#ff5f57', '#ffbd2e', '#28ca41'].map((c, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
            <div className="flex-1 flex justify-center">
              <div className="bg-land-bg3 rounded-md px-4 text-[12px] text-land-text3 font-medium py-1">
                formcraft.io/customer-feedback
              </div>
            </div>
          </div>
          <div className="p-6 pb-7 rounded-b-5">
            <div className="font-bold text-[20px] text-land-text mb-1" style={{ fontFamily: 'Manrope,sans-serif' }}>Customer Feedback</div>
            <div className="text-[13px] text-land-text2 mb-5">Help us improve your experience.</div>
            <div className="grid grid-cols-2 gap-3 mb-3.5">
              {[
                { l: 'Full Name', v: 'Alex Johnson', active: true },
                { l: 'Email', v: 'alex@example.com', active: false },
              ].map(({ l, v, active }) => (
                <div key={l}>
                  <div className="text-[12px] font-bold text-land-text2 mb-1.5 tracking-[0.03em]">{l}</div>
                  <div className={[
                    'rounded-lg px-3 py-2.5 text-[14px] border-[1.5px]',
                    active
                      ? 'border-land-accent bg-land-bg2 text-land-text shadow-[0_0_0_3px_rgba(106,99,255,0.25)]'
                      : 'border-transparent bg-land-bg3 text-land-text2',
                  ].join(' ')}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-3.5">
              <div className="text-[12px] font-bold text-land-text2 mb-1.5 tracking-[0.03em]">Experience Rating</div>
              <div className="flex gap-1.5">
                {RATINGS.map((r, i) => (
                  <div key={r} className={[
                    'flex-1 text-center py-2 px-0.5 rounded-lg text-[11px] font-bold border-[1.5px]',
                    i === 2
                      ? 'bg-[rgba(106,99,255,0.12)] border-[rgba(106,99,255,0.3)] text-land-accent3'
                      : 'bg-land-bg3 border-transparent text-land-text2',
                  ].join(' ')}>
                    {r}
                  </div>
                ))}
              </div>
            </div>
            <button
              className="w-full flex justify-center items-center py-3 rounded-md text-[14px] font-bold text-[#fbf7ff]"
              style={{ background: 'linear-gradient(135deg,#4e45e2,#6a63ff)' }}
            >
              Submit Response
            </button>
          </div>

          {/* Floating badge — Live */}
          <div
            className="absolute -top-3.5 -right-3.5 bg-land-bg2 rounded-3 px-3.5 py-2 flex items-center gap-2 border border-land-border2"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500" style={{ boxShadow: '0 0 8px rgba(34,197,94,.6)' }} />
            <span className="text-[13px] font-semibold text-land-text">Live · 24 responses</span>
          </div>

          {/* Floating badge — Published */}
          <div
            className="absolute bottom-5 -left-4.5 bg-land-bg2 rounded-3 px-3.5 py-2 flex items-center gap-2 border border-land-border2"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}
          >
            <ZapIcon />
            <span className="text-[13px] font-semibold text-land-text">Published in 2 min</span>
          </div>
        </div>
      </div>
    </section>
  )
}
