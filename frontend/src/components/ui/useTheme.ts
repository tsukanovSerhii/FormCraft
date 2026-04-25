import { useContext } from 'react'
import { ThemeContext } from './ThemeToggle'

export function useTheme() {
  return useContext(ThemeContext)
}
