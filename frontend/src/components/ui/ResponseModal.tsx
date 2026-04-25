import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { FormResponse } from '@/store/responsesStore'

interface ResponseModalProps {
  response: FormResponse
  onClose: () => void
}

function formatDate(ts: number) {
  return new Intl.DateTimeFormat('en', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(ts)
}

function formatValue(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ')
  if (v === null || v === undefined || v === '') return '—'
  return String(v)
}

export default function ResponseModal({ response, onClose }: ResponseModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const entries = Object.entries(response.data)

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-[15px] font-semibold text-text-primary">{response.formTitle}</h2>
            <p className="text-xs text-text-muted">{formatDate(response.submittedAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
          >
            <X size={15} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {entries.length === 0 ? (
            <p className="text-sm text-text-muted">No data in this response.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {entries.map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-text-muted">{key}</span>
                  <span className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary">
                    {formatValue(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="h-8 rounded-lg bg-surface-secondary px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
