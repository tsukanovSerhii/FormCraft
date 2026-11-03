import { useEffect, useLayoutEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type SSEHandler = (data: unknown) => void

export function useSSE(onMessage: SSEHandler) {
  const { accessToken } = useAuthStore()
  const handlerRef = useRef(onMessage)
  useLayoutEffect(() => { handlerRef.current = onMessage })

  useEffect(() => {
    if (!accessToken) return

    const es = new EventSource(`${BASE}/api/notifications/stream`, { withCredentials: true }) // auth via refresh cookie

    es.onmessage = (e) => {
      try { handlerRef.current(JSON.parse(e.data)) } catch { /* ignore malformed */ }
    }

    return () => es.close()
  }, [accessToken])
}
