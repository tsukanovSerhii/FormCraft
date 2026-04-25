import { useEffect, useRef } from 'react'

export function useDebounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T {
  const fnRef = useRef(fn)

  useEffect(() => {
    fnRef.current = fn
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return ((...args: Parameters<T>) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fnRef.current(...args), delay)
  }) as T
}
