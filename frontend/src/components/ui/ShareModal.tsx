import { Check, Code2, Copy, Link, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ShareModalProps {
  formId: string
  formTitle: string
  onClose: () => void
}

type Tab = 'link' | 'embed'

function QRCode({ url }: { url: string }) {
  const size = 160
  const encoded = encodeURIComponent(url)
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=ffffff&color=000000&margin=8`}
      alt="QR code"
      width={size}
      height={size}
      className="rounded-lg border border-border"
    />
  )
}

function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary">{label}</label>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-secondary px-3 py-2">
        <span className="flex-1 truncate font-mono text-xs text-text-primary">{value}</span>
        <button
          onClick={copy}
          className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export default function ShareModal({ formId, formTitle, onClose }: ShareModalProps) {
  const [tab, setTab] = useState<Tab>('link')
  const overlayRef = useRef<HTMLDivElement>(null)

  const publicUrl = `${window.location.origin}/f/${formId}`
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0" style="border-radius:12px;border:1px solid #e5e7eb;"></iframe>`

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-[15px] font-semibold text-text-primary">Share form</h2>
            <p className="text-xs text-text-muted">{formTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          {([
            { id: 'link' as Tab, label: 'Link', icon: Link },
            { id: 'embed' as Tab, label: 'Embed', icon: Code2 },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={[
                'relative flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors',
                tab === id
                  ? 'text-brand after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brand'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'link' && (
            <div className="flex flex-col gap-5">
              <CopyField value={publicUrl} label="Public link" />
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs text-text-muted">Scan to open on mobile</p>
                <QRCode url={publicUrl} />
              </div>
            </div>
          )}

          {tab === 'embed' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-text-secondary">
                Paste this snippet into any HTML page to embed your form.
              </p>
              <CopyField value={embedCode} label="Embed code" />
              <div className="rounded-lg border border-border bg-surface-secondary p-3">
                <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-text-muted">{embedCode}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
