import { CheckCircle, X, XCircle } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { ToastContext } from './ToastContext'

type ToastType = 'success' | 'error'

interface Toast {
  id: number
  message: string
  type: ToastType
}

let _id = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const add = useCallback((message: string, type: ToastType) => {
    const id = ++_id
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ success: m => add(m, 'success'), error: m => add(m, 'error') }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={[
              'flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all',
              'animate-in slide-in-from-bottom-2 duration-200',
              t.type === 'success'
                ? 'border-green-200 bg-white text-green-800'
                : 'border-red-200 bg-white text-red-700',
            ].join(' ')}
          >
            {t.type === 'success'
              ? <CheckCircle size={16} className="shrink-0 text-green-500" />
              : <XCircle size={16} className="shrink-0 text-red-500" />}
            <span className="text-[13px] font-medium">{t.message}</span>
            <button onClick={() => remove(t.id)} className="ml-1 text-current opacity-40 hover:opacity-70">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
