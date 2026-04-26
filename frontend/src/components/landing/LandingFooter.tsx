import { LogoMark } from './LandingIcons'

const LINKS = ['Privacy', 'Terms', 'Status', 'Contact']

export function LandingFooter() {
  return (
    <footer className="px-10 py-10 border-t border-land-border bg-land-bg2">
      <div className="max-w-300 mx-auto flex justify-between items-center flex-wrap gap-5">
        <div className="flex items-center gap-2.25">
          <LogoMark />
          <span className="font-bold text-[16px] tracking-[-0.5px] text-land-text">FormCraft</span>
        </div>
        <div className="flex gap-7">
          {LINKS.map(l => (
            <a key={l} href="#" className="text-[13px] text-land-text3 hover:text-land-text2 transition-colors">
              {l}
            </a>
          ))}
        </div>
        <div className="text-[13px] text-land-text3">© {new Date().getFullYear()} FormCraft</div>
      </div>
    </footer>
  )
}
