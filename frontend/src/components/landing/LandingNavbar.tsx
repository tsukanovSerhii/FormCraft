import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LogoMark, ArrowRightIcon } from './LandingIcons'

const NAV_LINKS = [
  { label: 'Features',     href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing',      href: '#pricing' },
  { label: 'Docs',         href: '#docs' },
]

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handle)
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-100 px-10 transition-all duration-300',
        scrolled ? 'bg-[rgba(12,13,17,0.85)] backdrop-blur-xl border-b border-land-border' : '',
      ].join(' ')}
    >
      <div className="max-w-300 mx-auto h-17 flex items-center gap-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.25 bg-transparent border-none cursor-pointer p-0"
        >
          <LogoMark />
          <span className="font-bold text-[17px] tracking-[-0.5px] text-land-text">FormCraft</span>
        </button>

        <div className="flex gap-7 flex-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={e => {
                e.preventDefault()
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-[14px] font-medium text-land-text2 hover:text-land-text transition-colors cursor-pointer"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="text-[14px] font-medium text-land-text2 hover:text-land-text transition-colors px-2 py-2 rounded-lg">
            Sign in
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-4.5 py-2.25 rounded-md text-[14px] font-bold text-[#fbf7ff] transition-all hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg,#4e45e2 0%,#6a63ff 100%)', boxShadow: '0 4px 20px rgba(106,99,255,0.25)' }}
          >
            Get started <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>
    </nav>
  )
}
