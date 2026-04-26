import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'

type SSEHandler = (data: unknown) => void

export function useSSE(onMessage: SSEHandler) {
  const { accessToken } = useAuthStore()
  const handlerRef = useRef(onMessage)
  handlerRef.current = onMessage

  useEffect(() => {
    if (!accessToken) return

    const url = `/api/notifications/stream`
    const es = new EventSource(url, { withCredentials: true })

    es.onmessage = (e) => {
      try {
        handlerRef.current(JSON.parse(e.data))
      } catch { /* ignore malformed */ }
    }

    es.onerror = () => {
      // EventSource auto-reconnects; nothing to do
    }

    return () => es.close()
  }, [accessToken])
}
