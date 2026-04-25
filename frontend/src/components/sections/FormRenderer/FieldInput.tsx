import { Star } from 'lucide-react'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import type { FormField } from '@/types/form'

const inputClass = 'w-full rounded-lg border border-border bg-surface-secondary px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none transition-colors'
const errorClass = 'border-error focus:border-error'

interface FieldInputProps {
  field: FormField
  error?: string
}

export default function FieldInput({ field, error }: FieldInputProps) {
  const [rating, setRating] = useState(0)

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'number':
      return (
        <Controller
          name={field.id}
          render={({ field: f }) => (
            <input
              {...f}
              type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
              placeholder={field.placeholder ?? ''}
              className={[inputClass, error ? errorClass : ''].join(' ')}
            />
          )}
        />
      )

    case 'textarea':
      return (
        <Controller
          name={field.id}
          render={({ field: f }) => (
            <textarea
              {...f}
              rows={4}
              placeholder={field.placeholder ?? ''}
              className={[inputClass, 'resize-none', error ? errorClass : ''].join(' ')}
            />
          )}
        />
      )

    case 'date':
      return (
        <Controller
          name={field.id}
          render={({ field: f }) => (
            <input
              {...f}
              type="date"
              className={[inputClass, error ? errorClass : ''].join(' ')}
            />
          )}
        />
      )

    case 'radio':
      return (
        <Controller
          name={field.id}
          render={({ field: f }) => (
            <div className="flex flex-col gap-2">
              {(field.options ?? []).map(opt => (
                <label key={opt.id} className="flex cursor-pointer items-center gap-3">
                  <span className={[
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    f.value === opt.id ? 'border-brand' : error ? 'border-error' : 'border-border',
                  ].join(' ')}>
                    {f.value === opt.id && <span className="h-2 w-2 rounded-full bg-brand" />}
                  </span>
                  <span className="text-[13px] text-text-primary">{opt.label}</span>
                  <input type="radio" className="hidden" checked={f.value === opt.id} onChange={() => f.onChange(opt.id)} />
                </label>
              ))}
            </div>
          )}
        />
      )

    case 'checkbox':
      return (
        <Controller
          name={field.id}
          render={({ field: f }) => {
            const selected: string[] = f.value ?? []
            function toggle(id: string) {
              f.onChange(selected.includes(id) ? selected.filter(v => v !== id) : [...selected, id])
            }
            return (
              <div className="flex flex-col gap-2">
                {(field.options ?? []).map(opt => {
                  const checked = selected.includes(opt.id)
                  return (
                    <label key={opt.id} onClick={() => toggle(opt.id)} className="flex cursor-pointer items-center gap-3">
                      <span className={[
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors',
                        checked ? 'border-brand bg-brand' : error ? 'border-error' : 'border-border',
                      ].join(' ')}>
                        {checked && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="text-[13px] text-text-primary">{opt.label}</span>
                    </label>
                  )
                })}
              </div>
            )
          }}
        />
      )

    case 'select':
      return (
        <Controller
          name={field.id}
          render={({ field: f }) => (
            <select {...f} className={[inputClass, error ? errorClass : ''].join(' ')}>
              <option value="">Select an option...</option>
              {(field.options ?? []).map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          )}
        />
      )

    case 'rating': {
      const max = field.ratingMax ?? 5
      return (
        <Controller
          name={field.id}
          render={({ field: f }) => {
            const current = Number(f.value ?? 0) || rating
            return (
              <div className="flex gap-1">
                {Array.from({ length: max }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={[
                      'cursor-pointer transition-colors',
                      i < current ? 'fill-[#ffa502] text-[#ffa502]' : error ? 'text-error' : 'text-border hover:text-[#ffa502]',
                    ].join(' ')}
                    onClick={() => { setRating(i + 1); f.onChange(i + 1) }}
                  />
                ))}
              </div>
            )
          }}
        />
      )
    }

    case 'file':
      return (
        <Controller
          name={field.id}
          render={({ field: f }) => (
            <label className={[
              'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 transition-colors',
              error ? 'border-error' : 'border-border hover:border-brand-light',
            ].join(' ')}>
              <p className="text-[13px] text-text-muted">
                {f.value ? (f.value as File).name : 'Click to upload or drag & drop'}
              </p>
              <input type="file" className="hidden" onChange={e => f.onChange(e.target.files?.[0])} />
            </label>
          )}
        />
      )

    default:
      return null
  }
}
