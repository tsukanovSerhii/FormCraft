import { useFormBuilderStore } from '@/store/formBuilderStore'
import { useToast } from '@/components/ui/useToast'
import type { Form } from '@/types/form'

interface Props {
  form: Form
  expiresAt: string
  maxResponses: string
  onExpiresAtChange: (v: string) => void
  onMaxResponsesChange: (v: string) => void
  onClose: () => void
}

export function FormSettingsModal({ form, expiresAt, maxResponses, onExpiresAtChange, onMaxResponsesChange, onClose }: Props) {
  const { updateFormSettings } = useFormBuilderStore()
  const toast = useToast()

  function handleSave() {
    updateFormSettings(form.id, {
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      maxResponses: maxResponses ? parseInt(maxResponses) : null,
    })
    onClose()
    toast.success('Settings saved')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface shadow-panel">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-[15px] font-semibold text-text-primary">Form Settings</p>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">✕</button>
        </div>
        <div className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-text-secondary">Expiry date</label>
            <input
              type="date"
              value={expiresAt}
              onChange={e => onExpiresAtChange(e.target.value)}
              className="h-9 rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-brand focus:outline-none"
            />
            <p className="text-[11px] text-text-muted">Form stops accepting responses after this date.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-text-secondary">Max responses</label>
            <input
              type="number"
              min={1}
              value={maxResponses}
              onChange={e => onMaxResponsesChange(e.target.value)}
              placeholder="Unlimited"
              className="h-9 rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-brand focus:outline-none"
            />
            <p className="text-[11px] text-text-muted">Close the form automatically after this many responses.</p>
          </div>
        </div>
        <div className="flex gap-2 border-t border-border px-5 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-border py-2 text-[13px] font-medium text-text-secondary transition-colors hover:border-border-strong"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-md bg-brand py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
