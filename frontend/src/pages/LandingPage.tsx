import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BarChart2, Download, Globe, Layout, Share2, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://formcraft.app'

// ── palette (warm slate + amber, no purple) ──────────────────
const P = {
  bg:        '#0f1117',   // near-black warm
  bgCard:    '#181b23',   // card surface
  bgStripe:  '#1d2029',   // alternating row
  border:    '#272b36',   // subtle border
  borderMid: '#343845',   // stronger border
  amber:     '#f59e0b',   // main accent
  amberDim:  '#b45309',
  amberGlow: 'rgba(245,158,11,0.12)',
  white:     '#f5f5f0',   // warm white for text
  muted:     '#7a8094',   // muted text
  dim:       '#3d4252',   // very muted / numbers
}

const FEATURES = [
  { icon: Layout,    title: 'Drag & drop builder',  desc: '11 field types. Reorder in seconds.' },
  { icon: Zap,       title: 'One-click publish',     desc: 'Share link, QR code, or iframe embed.' },
  { icon: BarChart2, title: 'Live response feed',    desc: 'Submissions appear instantly.' },
  { icon: Download,  title: 'CSV export',            desc: 'Your data. Your format. One button.' },
  { icon: Globe,     title: 'Public forms',          desc: 'Respondents need zero accounts.' },
  { icon: Share2,    title: 'Version history',       desc: 'Restore any past snapshot of a form.' },
]

const NUMBERS = [
  { value: '11', label: 'Field types' },
  { value: '∞',  label: 'Forms, free' },
  { value: '0',  label: 'Lines of code needed' },
  { value: '2m', label: 'To your first live form' },
]

const STEPS = [
  { n: '01', title: 'Build', body: 'Drag any field type onto the canvas. Set labels, validation, and conditional logic — all inline.' },
  { n: '02', title: 'Publish', body: 'One click makes it live. Share via link, QR code, or drop an iframe into any page.' },
  { n: '03', title: 'Collect', body: 'Responses land in your dashboard. Filter, search, and export to CSV instantly.' },
]

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>FormCraft — Build forms that mean business</title>
        <meta name="description" content="FormCraft is a free, modern form builder. Drag, publish, collect — no code required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="FormCraft — Build forms that mean business" />
        <meta property="og:description" content="Drag, publish, collect. No code, no credit card." />
        <meta name="twitter:card" content="summary" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'FormCraft',
          url: SITE_URL,
          description: 'Free online form builder with drag-and-drop simplicity.',
          applicationCategory: 'BusinessApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}</script>
      </Helmet>

      <div style={{ background: P.bg, color: P.white, fontFamily: 'inherit', minHeight: '100vh' }}>

        {/* ── Nav ──────────────────────────────────────────────── */}
        <nav style={{ borderBottom: `1px solid ${P.border}`, background: `${P.bg}e6`, backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', height: 56, alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: P.amber, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill={P.bg} />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill={P.bg} opacity="0.6" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill={P.bg} opacity="0.6" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill={P.bg} />
                </svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.02em', color: P.white }}>FormCraft</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ThemeToggle />
              <Link
                to="/login"
                style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, color: P.muted, textDecoration: 'none', borderRadius: 6, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = P.white)}
                onMouseLeave={e => (e.currentTarget.style.color = P.muted)}
              >
                Sign in
              </Link>
              <Link
                to="/login"
                style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 16px', borderRadius: 6, background: P.amber, color: P.bg, fontSize: 13, fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.01em' }}
              >
                Get started <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section style={{ borderBottom: `1px solid ${P.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

            {/* Left */}
            <div style={{ borderRight: `1px solid ${P.border}`, padding: '80px 64px 80px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 99, border: `1px solid ${P.border}`, padding: '4px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: P.muted, marginBottom: 28, width: 'fit-content' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                Free · No card required
              </div>

              <h1 style={{ fontSize: 'clamp(52px, 7vw, 84px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.04em', color: P.white, margin: 0 }}>
                Forms<br />
                <span style={{ color: P.amber }}>that</span><br />
                work.
              </h1>

              <p style={{ marginTop: 32, fontSize: 16, lineHeight: 1.65, color: P.muted, maxWidth: 360 }}>
                Drag fields. Hit publish. Watch responses roll in. No code, no friction — just a form builder that gets out of your way.
              </p>

              <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  to="/login"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 32px', borderRadius: 6, background: P.amber, color: P.bg, fontSize: 14, fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.01em' }}
                >
                  Start for free <ArrowRight size={15} />
                </Link>
                <Link
                  to="/login"
                  style={{ display: 'flex', alignItems: 'center', height: 48, padding: '0 32px', borderRadius: 6, border: `1px solid ${P.border}`, color: P.white, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* Right — stats */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {NUMBERS.map(({ value, label }, i) => (
                <div
                  key={label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 20,
                    padding: '28px 40px',
                    borderBottom: i < NUMBERS.length - 1 ? `1px solid ${P.border}` : undefined,
                    background: i % 2 === 1 ? P.bgStripe : 'transparent',
                  }}
                >
                  <span style={{ width: 96, flexShrink: 0, fontSize: 48, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', color: P.amber }}>
                    {value}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: P.muted }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Marquee strip ────────────────────────────────────── */}
        <div style={{ borderBottom: `1px solid ${P.border}`, background: P.bgCard, padding: '12px 0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', whiteSpace: 'nowrap' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} style={{ margin: '0 32px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.muted }}>
                Drag &amp; Drop &nbsp;·&nbsp; Instant Publish &nbsp;·&nbsp; CSV Export &nbsp;·&nbsp; QR Codes &nbsp;·&nbsp; Version History &nbsp;·&nbsp; Conditional Logic &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ── Features ─────────────────────────────────────────── */}
        <section style={{ borderBottom: `1px solid ${P.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* label row */}
            <div style={{ borderBottom: `1px solid ${P.border}`, padding: '20px 24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.muted, margin: 0 }}>
                What's inside
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  style={{
                    padding: '36px 28px',
                    borderRight: i % 3 !== 2 ? `1px solid ${P.border}` : undefined,
                    borderBottom: i < 3 ? `1px solid ${P.border}` : undefined,
                    background: 'transparent',
                    position: 'relative',
                    transition: 'background 0.15s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = P.bgStripe)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: P.amberGlow, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <f.icon size={17} style={{ color: P.amber }} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: P.white, margin: '0 0 6px' }}>{f.title}</p>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: P.muted, margin: 0 }}>{f.desc}</p>
                  <ArrowUpRight size={13} style={{ position: 'absolute', top: 20, right: 20, color: P.dim }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section style={{ borderBottom: `1px solid ${P.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ borderBottom: `1px solid ${P.border}`, padding: '20px 24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.muted, margin: 0 }}>
                How it works
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  style={{
                    padding: '48px 36px',
                    borderRight: i < 2 ? `1px solid ${P.border}` : undefined,
                  }}
                >
                  <span style={{ display: 'block', fontSize: 72, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em', color: P.dim }}>
                    {s.n}
                  </span>
                  <p style={{ marginTop: 20, fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', color: P.white }}>{s.title}</p>
                  <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.65, color: P.muted }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────── */}
        <section style={{ borderBottom: `1px solid ${P.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {[
              { quote: '"FormCraft replaced three tools for us. Build, share, analyse — all in one place."', name: 'Maya K.', role: 'Product designer', initials: 'MK' },
              { quote: '"I published my first form in under 2 minutes. The UX just gets out of the way."', name: 'James R.', role: 'Startup founder', initials: 'JR' },
            ].map((t, i) => (
              <div
                key={t.name}
                style={{
                  padding: '56px 40px',
                  borderRight: i === 0 ? `1px solid ${P.border}` : undefined,
                  background: i === 1 ? P.bgStripe : 'transparent',
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: P.muted, marginBottom: 24 }}>
                  {i === 0 ? 'From the community' : 'Also said'}
                </p>
                <blockquote style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.35, letterSpacing: '-0.02em', color: P.white, margin: '0 0 32px' }}>
                  {t.quote}
                </blockquote>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: i === 0 ? P.amber : P.bgCard, border: `1px solid ${P.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: i === 0 ? P.bg : P.muted }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: P.white, margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: P.muted, margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section style={{ borderBottom: `1px solid ${P.border}`, background: P.amber }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '64px 24px', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.bg, opacity: 0.55, marginBottom: 12 }}>
                Get started today
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', color: P.bg, margin: 0 }}>
                Your first form<br />is free. Forever.
              </h2>
            </div>
            <Link
              to="/login"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 6, background: P.bg, color: P.amber, fontSize: 15, fontWeight: 900, textDecoration: 'none', letterSpacing: '-0.02em', flexShrink: 0 }}
            >
              Start building <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer style={{ borderTop: `1px solid ${P.border}`, padding: '28px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 5, background: P.amber, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill={P.bg} />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill={P.bg} opacity="0.6" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill={P.bg} opacity="0.6" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill={P.bg} />
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-0.02em', color: P.white }}>FormCraft</span>
            </div>
            <p style={{ fontSize: 12, color: P.dim, margin: 0 }}>
              © {new Date().getFullYear()} FormCraft — built with care.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
