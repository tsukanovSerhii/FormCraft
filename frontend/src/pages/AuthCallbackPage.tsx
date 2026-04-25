import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function AuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = params.get('token')
    if (!token) { navigate('/login'); return }

    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })
      .then(r => r.json())
      .then(user => { setAuth(user, token); navigate('/forms') })
      .catch(() => navigate('/login'))
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 size={28} className="animate-spin text-brand" />
    </div>
  )
}
