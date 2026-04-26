import { GripVertical } from 'lucide-react'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import { FieldPreview } from './FieldPreview'
import type { FormField } from '@/types/form'

interface Props {
  field: FormField
  isSelected: boolean
}

export default function FieldItem({ field, isSelected }: Props) {
  const { selectField, updateField } = useFormBuilderStore()

  return (
    <div
      onMouseDown={() => selectField(field.id)}
      className={[
        'group relative flex cursor-pointer items-start gap-3 rounded-lg border bg-surface px-5 py-4 shadow-card transition-all',
        isSelected ? 'border-brand ring-1 ring-brand' : 'border-border hover:border-brand-light',
      ].join(' ')}
    >
      <GripVertical size={16} className="mt-1 shrink-0 cursor-grab text-text-placeholder opacity-0 group-hover:opacity-100" />
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-1">
          <p className="text-[14px] font-medium text-text-primary">{field.label}</p>
          {field.required && <span className="text-[12px] text-error">*</span>}
        </div>
        <FieldPreview field={field} onUpdate={patch => updateField(field.id, patch)} />
      </div>
    </div>
  )
}
