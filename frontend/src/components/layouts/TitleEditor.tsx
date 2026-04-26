import { useRef, useState } from 'react'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import type { Form } from '@/types/form'

interface Props {
  form: Form | null
}

export function TitleEditor({ form }: Props) {
  const { updateFormTitle } = useFormBuilderStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function startEditing() {
    setDraft(form?.title ?? '')
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commit() {
    if (form && draft.trim()) updateFormTitle(form.id, draft.trim())
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className="rounded-md border border-brand bg-surface-secondary px-2 py-1 text-[14px] font-semibold text-text-primary outline-none"
        style={{ minWidth: 120, width: `${Math.max(draft.length, 10)}ch` }}
      />
    )
  }

  return (
    <button
      onClick={startEditing}
      className="rounded-md px-2 py-1 text-[14px] font-semibold text-text-primary hover:bg-surface-secondary"
      title="Click to rename"
    >
      {form?.title ?? 'Untitled Form'}
    </button>
  )
}
