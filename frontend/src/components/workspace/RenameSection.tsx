import { Edit2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useToast } from '@/components/ui/useToast'

interface Props {
  workspaceId: string
  currentName: string
}

export function RenameSection({ workspaceId, currentName }: Props) {
  const { renameWorkspace } = useWorkspaceStore()
  const toast = useToast()
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState(currentName)
  const [busy, setBusy] = useState(false)

  async function handleRename(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setBusy(true)
    try {
      await renameWorkspace(workspaceId, newName.trim())
      setRenaming(false)
      toast.success('Workspace renamed')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Rename failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-border bg-surface p-5 shadow-card">
      <p className="mb-3 text-[14px] font-semibold text-text-primary">Workspace name</p>
      {renaming ? (
        <form onSubmit={handleRename} className="flex gap-2">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="flex-1 rounded-md border border-border bg-surface-secondary px-3 py-2 text-[13px] text-text-primary outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {busy && <Loader2 size={13} className="animate-spin" />} Save
          </button>
          <button type="button" onClick={() => setRenaming(false)} className="rounded-md border border-border px-4 py-2 text-[13px] text-text-secondary hover:bg-surface-secondary">
            Cancel
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-text-secondary">{currentName}</span>
          <button
            onClick={() => { setNewName(currentName); setRenaming(true) }}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[13px] text-text-secondary hover:bg-surface-secondary transition-colors"
          >
            <Edit2 size={13} /> Rename
          </button>
        </div>
      )}
    </div>
  )
}
