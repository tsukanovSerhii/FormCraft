import { GripVertical, Plus, X } from 'lucide-react'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { uid } from '@/lib/uid'
import type { FieldOption } from '@/types/form'

interface SortableOptionProps {
  opt: FieldOption
  index: number
  groupId: string
  shape: 'round' | 'square'
  onLabelChange: (id: string, label: string) => void
  onRemove: (id: string) => void
  canRemove: boolean
}

function SortableOption({ opt, index, groupId, shape, onLabelChange, onRemove, canRemove }: SortableOptionProps) {
  const { ref, handleRef, isDragging } = useSortable({ id: opt.id, index, group: groupId })

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="group/opt flex items-center gap-2"
    >
      <button ref={handleRef} className="cursor-grab text-text-muted hover:text-text-secondary">
        <GripVertical size={13} />
      </button>
      <span className={[
        'flex h-4 w-4 shrink-0 border border-border bg-surface',
        shape === 'round' ? 'rounded-full' : 'rounded',
      ].join(' ')} />
      <input
        value={opt.label}
        onChange={e => onLabelChange(opt.id, e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[13px] text-text-primary outline-none focus:border-b focus:border-brand"
      />
      {canRemove && (
        <button
          onClick={() => onRemove(opt.id)}
          className="opacity-0 transition-opacity group-hover/opt:opacity-100 text-text-muted hover:text-error"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}

interface Props {
  fieldId: string
  options: FieldOption[]
  shape: 'round' | 'square'
  onUpdate: (options: FieldOption[]) => void
}

export function OptionsEditorInline({ fieldId, options, shape, onUpdate }: Props) {
  const groupId = `options-${fieldId}`

  function updateLabel(id: string, label: string) {
    onUpdate(options.map(o => o.id === id ? { ...o, label } : o))
  }

  function removeOption(id: string) {
    onUpdate(options.filter(o => o.id !== id))
  }

  function addOption() {
    onUpdate([...options, { id: uid(), label: `Option ${options.length + 1}` }])
  }

  return (
    <DragDropProvider
      onDragEnd={({ operation }) => {
        const { source, target } = operation
        if (!source || !target || source.id === target.id) return
        const from = options.findIndex(o => o.id === source.id)
        const to = options.findIndex(o => o.id === target.id)
        if (from === -1 || to === -1) return
        const reordered = [...options]
        const [moved] = reordered.splice(from, 1)
        reordered.splice(to, 0, moved)
        onUpdate(reordered)
      }}
    >
      <div className="flex flex-col gap-1.5">
        {options.map((opt, index) => (
          <SortableOption
            key={opt.id}
            opt={opt}
            index={index}
            groupId={groupId}
            shape={shape}
            onLabelChange={updateLabel}
            onRemove={removeOption}
            canRemove={options.length > 1}
          />
        ))}
        <button
          onClick={addOption}
          className="flex items-center gap-1.5 pt-1 text-[12px] font-medium text-brand hover:underline"
        >
          <Plus size={13} /> Add option
        </button>
      </div>
    </DragDropProvider>
  )
}
