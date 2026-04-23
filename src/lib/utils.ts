import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(ts: number): string {
  const diff = Math.round((ts - Date.now()) / 86400000)
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diff, 'day')
}