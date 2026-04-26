import { StarIcon } from './LandingIcons'

const TESTIMONIALS = [
  { q: '"FormCraft replaced three tools for us. Build, share, analyse — all in one place."', name: 'Maya K.', role: 'Product Designer', stars: 5 },
  { q: '"I published my first form in under 2 minutes. The UX just gets out of the way."',  name: 'James R.', role: 'Startup Founder',   stars: 5 },
]

const LOGOS = ['Flowstate', 'Horizon', 'Crestline', 'Axum', 'Vela']

export function LandingTestimonials() {
  return (
    <section className="py-24 px-10 bg-land-bg2">
      <div className="max-w-300 mx-auto">
        <div className="text-center">
          <div className="text-[12px] font-bold tracking-[2px] text-land-accent uppercase mb-3.5">From the community</div>
          <h2 className="font-extrabold text-land-text" style={{ fontFamily: 'Manrope,sans-serif', fontSize: 'clamp(28px,3vw,42px)', letterSpacing: '-1.5px' }}>
            Loved by builders.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-land-bg rounded-5 p-9 border border-land-border transition-colors hover:border-land-border2">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="text-[20px] font-semibold text-land-text leading-normal mb-7" style={{ fontFamily: 'Manrope,sans-serif', letterSpacing: '-.3px' }}>
                {t.q}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10.5 h-10.5 rounded-full flex items-center justify-center font-bold text-[15px] text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg,#4e45e2,#6a63ff)' }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold text-[14px] text-land-text">{t.name}</div>
                  <div className="text-[13px] text-land-text3">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-12 items-center flex-wrap mt-16 pt-12 border-t border-land-border">
          <div className="text-[12px] font-bold tracking-[2px] text-land-text3 mr-2">TRUSTED BY</div>
          {LOGOS.map(c => (
            <div key={c} className="font-extrabold text-[18px] text-land-text3 tracking-[-0.5px] hover:text-land-text2 transition-colors cursor-default" style={{ fontFamily: 'Manrope,sans-serif' }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
