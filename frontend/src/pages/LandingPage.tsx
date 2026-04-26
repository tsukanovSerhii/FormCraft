import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingTicker } from '@/components/landing/LandingTicker'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
import { LandingCTA } from '@/components/landing/LandingCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'

const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://formcraft.app'

export default function LandingPage() {
  const navigate = useNavigate()
  const goToApp = () => navigate('/login')

  return (
    <>
      <Helmet>
        <title>FormCraft — Forms that work.</title>
        <meta name="description" content="FormCraft is a free, modern form builder. Drag, publish, collect — no code required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="FormCraft — Forms that work." />
        <meta property="og:description" content="Drag, publish, collect. No code, no credit card." />
        <meta name="twitter:card" content="summary" />
        <meta name="robots" content="index, follow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
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

      <div className="bg-land-bg text-land-text min-h-screen" style={{ fontFamily: 'Inter,sans-serif' }}>
        <LandingNavbar />
        <LandingHero onCTA={goToApp} />
        <LandingTicker />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingCTA />
        <LandingFooter />
      </div>
    </>
  )
}
