import { useEffect, useLayoutEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'

type SSEHandler = (data: unknown) => void

export function useSSE(onMessage: SSEHandler) {
  const { accessToken } = useAuthStore()
  const handlerRef = useRef(onMessage)
  useLayoutEffect(() => { handlerRef.current = onMessage })

  useEffect(() => {
    if (!accessToken) return

    const es = new EventSource('/api/notifications/stream', { withCredentials: true })

    es.onmessage = (e) => {
      try { handlerRef.current(JSON.parse(e.data)) } catch { /* ignore malformed */ }
    }

    return () => es.close()
  }, [accessToken])
}
