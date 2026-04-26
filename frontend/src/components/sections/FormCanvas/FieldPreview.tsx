import { Star } from 'lucide-react'
import { Input, Textarea } from '@/components/ui'
import { OptionsEditorInline } from './OptionsEditorInline'
import type { FormField } from '@/types/form'

interface Props {
  field: FormField
  onUpdate: (patch: Partial<FormField>) => void
}

export function FieldPreview({ field, onUpdate }: Props) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'number':
      return (
        <Input
          type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
          value={field.defaultValue ?? ''}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          onChange={e => onUpdate({ defaultValue: e.target.value })}
        />
      )

    case 'textarea':
      return (
        <Textarea
          rows={3}
          value={field.defaultValue ?? ''}
          placeholder={field.placeholder || 'Enter your answer...'}
          onChange={e => onUpdate({ defaultValue: e.target.value })}
        />
      )

    case 'date':
      return (
        <Input
          type="date"
          value={field.defaultValue ?? ''}
          onChange={e => onUpdate({ defaultValue: e.target.value })}
        />
      )

    case 'radio':
      return (
        <OptionsEditorInline
          fieldId={field.id}
          options={field.options ?? []}
          shape="round"
          onUpdate={options => onUpdate({ options })}
        />
      )

    case 'checkbox':
    case 'select':
      return (
        <OptionsEditorInline
          fieldId={field.id}
          options={field.options ?? []}
          shape="square"
          onUpdate={options => onUpdate({ options })}
        />
      )

    case 'rating': {
      const max = field.ratingMax ?? 5
      const current = Number(field.defaultValue ?? 0)
      return (
        <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <Star
              key={i}
              size={20}
              className={i < current ? 'fill-[#ffa502] text-[#ffa502]' : 'text-text-placeholder'}
              onClick={() => onUpdate({ defaultValue: String(i + 1) })}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      )
    }

    case 'file':
      return (
        <div className="flex items-center justify-center rounded-md border-2 border-dashed border-border bg-surface-secondary py-6 text-[13px] text-text-muted">
          Click to upload or drag & drop
        </div>
      )

    default:
      return null
  }
}
