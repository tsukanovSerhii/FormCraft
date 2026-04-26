import { Link } from 'react-router-dom'

export function LandingCTA() {
  return (
    <section className="py-30 px-10 relative overflow-hidden bg-land-bg">
      <div className="absolute w-150 h-150 rounded-full pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle,rgba(106,99,255,.12) 0%,transparent 65%)' }}
      />
      <div className="max-w-180 mx-auto text-center relative z-1">
        <div className="text-[12px] font-bold tracking-[2px] text-land-accent uppercase mb-3.5">Get started today</div>
        <h2
          className="font-black text-land-text leading-[1.08] mb-5"
          style={{ fontFamily: 'Manrope,sans-serif', fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-2.5px' }}
        >
          Your first form<br />
          is{' '}
          <span style={{ background: 'linear-gradient(135deg,#8b85ff,#6a63ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            free. Forever.
          </span>
        </h2>
        <p className="text-[17px] text-land-text2 mb-10 leading-relaxed">No credit card. No lock-in. Just great forms.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-8.5 py-3.75 rounded-lg text-[17px] font-bold text-[#fbf7ff] transition-all hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg,#4e45e2 0%,#6a63ff 100%)', boxShadow: '0 4px 20px rgba(106,99,255,0.25)' }}
        >
          Start building
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
