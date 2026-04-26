const STEPS = [
  { n: '01', title: 'Build',   desc: 'Drag any field type onto the canvas. Set labels, validation, and conditional logic — all inline.' },
  { n: '02', title: 'Publish', desc: 'One click makes it live. Share via link, QR code, or drop an iframe into any page.' },
  { n: '03', title: 'Collect', desc: 'Responses land in your dashboard. Filter, search, and export to CSV instantly.' },
]

export function LandingHowItWorks() {
  return (
    <section className="py-24 px-10 bg-land-bg">
      <div className="max-w-300 mx-auto">
        <div className="text-center">
          <div className="text-[12px] font-bold tracking-[2px] text-land-accent uppercase mb-3.5">How it works</div>
          <h2
            className="font-extrabold text-land-text"
            style={{ fontFamily: 'Manrope,sans-serif', fontSize: 'clamp(28px,3vw,42px)', letterSpacing: '-1.5px' }}
          >
            Three steps to live.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-px bg-land-border rounded-[20px] overflow-hidden">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className={[
                'group bg-land-bg2 px-10 py-12 relative',
                i === 0 ? 'rounded-l-[20px]' : '',
                i === STEPS.length - 1 ? 'rounded-r-[20px]' : '',
              ].join(' ')}
            >
              <div
                className="font-black text-[80px] leading-none mb-6 transition-colors duration-200 group-hover:text-land-accent"
                style={{ fontFamily: 'Manrope,sans-serif', letterSpacing: '-4px', color: 'rgba(255,255,255,0.12)' }}
              >
                {s.n}
              </div>
              <div className="font-bold text-[22px] text-land-text mb-3" style={{ fontFamily: 'Manrope,sans-serif' }}>{s.title}</div>
              <div className="text-[15px] text-land-text2 leading-[1.7]">{s.desc}</div>
              {i < STEPS.length - 1 && (
                <div
                  className="absolute top-12 right-0 w-px h-20"
                  style={{ background: 'linear-gradient(to bottom,#6a63ff,transparent)' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
