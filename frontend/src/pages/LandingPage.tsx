import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart2, CheckCircle, Globe, Layers, Zap } from 'lucide-react'

const FEATURES = [
  { icon: Layers, title: 'Drag & drop builder', description: 'Create forms visually with 11 field types — no code required.' },
  { icon: Zap, title: 'Instant publish', description: 'Share a public link, embed an iframe, or scan a QR code in seconds.' },
  { icon: BarChart2, title: 'Real-time responses', description: 'View, filter, search, and export submissions as CSV.' },
  { icon: Globe, title: 'Public forms', description: 'Anyone can fill your form — no account needed on their end.' },
  { icon: CheckCircle, title: 'Built-in validation', description: 'Required fields, email format, min/max length — all configurable.' },
  { icon: Layers, title: 'Templates', description: 'Start fast with ready-made templates or save your own.' },
]

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
          <rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
          <rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
          <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
        </svg>
      </div>
      <span className="text-[15px] font-bold tracking-tight text-text-primary">FormCraft</span>
    </div>
  )
}

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>FormCraft — Build beautiful forms in minutes</title>
        <meta name="description" content="FormCraft is a free online form builder. Create surveys, contact forms, and quizzes with drag-and-drop simplicity." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FormCraft — Build beautiful forms in minutes" />
        <meta property="og:description" content="Create surveys, contact forms, and quizzes with drag-and-drop simplicity." />
        <meta name="twitter:card" content="summary" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'FormCraft',
          description: 'Free online form builder with drag-and-drop simplicity.',
          applicationCategory: 'BusinessApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-surface-secondary">
        {/* Nav */}
        <nav className="border-b border-border bg-surface px-6 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Logo />
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-[13px] font-medium text-text-secondary hover:text-text-primary"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="flex h-8 items-center gap-1.5 rounded-md bg-brand px-4 text-[13px] font-medium text-white hover:bg-brand/90"
              >
                Get started <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="px-6 py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-[42px] font-bold leading-tight tracking-tight text-text-primary">
              Build beautiful forms<br />in minutes
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-text-secondary">
              Drag-and-drop form builder with real-time responses, CSV export, and instant sharing.
              No code. No credit card.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                to="/login"
                className="flex h-10 items-center gap-2 rounded-md bg-brand px-6 text-[14px] font-semibold text-white hover:bg-brand/90"
              >
                Start for free <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-[22px] font-bold text-text-primary">
              Everything you need
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(f => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border bg-surface p-6 shadow-card"
                >
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-muted text-brand">
                    <f.icon size={18} />
                  </div>
                  <p className="text-[14px] font-semibold text-text-primary">{f.title}</p>
                  <p className="mt-1 text-[13px] text-text-muted">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-surface px-6 py-20 text-center">
          <h2 className="text-[26px] font-bold text-text-primary">Ready to get started?</h2>
          <p className="mt-2 text-[14px] text-text-muted">
            Join thousands of teams collecting responses with FormCraft.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-brand px-6 text-[14px] font-semibold text-white hover:bg-brand/90"
          >
            Create your first form <ArrowRight size={14} />
          </Link>
        </section>

        <footer className="border-t border-border px-6 py-6 text-center text-[12px] text-text-muted">
          © {new Date().getFullYear()} FormCraft. All rights reserved.
        </footer>
      </div>
    </>
  )
}
