import { useContext, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { ThemeContext } from './ThemeContext'
import type { Theme } from './ThemeContext'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useContext(ThemeContext)
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={[
        'flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-surface-secondary',
        className,
      ].filter(Boolean).join(' ')}
    >
      {theme === 'dark'
        ? <Sun size={15} style={{ color: '#f5c518' }} />
        : <Moon size={15} className="text-text-muted" />
      }
    </button>
  )
}
