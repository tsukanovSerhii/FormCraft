import { type FormVersion } from '@/api/versions'

interface Props {
  formId: string
  versions: FormVersion[]
  loading: boolean
  onClose: () => void
  onRestore: (versionId: string) => Promise<void>
}

export function VersionHistoryModal({ versions, loading, onClose, onRestore }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-panel">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-[15px] font-semibold text-text-primary">Version History</p>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">✕</button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            </div>
          ) : versions.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-text-muted">
              No versions yet. Versions are saved when you publish a form.
            </p>
          ) : versions.map(v => (
            <div key={v.id} className="flex items-center justify-between border-b border-border px-5 py-3.5 last:border-0">
              <div>
                <p className="text-[13px] font-medium text-text-primary">v{v.version} — {v.title}</p>
                <p className="text-[11px] text-text-muted">{new Date(v.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => onRestore(v.id)}
                className="rounded-md border border-border px-3 py-1 text-[12px] font-medium text-text-secondary transition-colors hover:border-brand hover:text-brand"
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

