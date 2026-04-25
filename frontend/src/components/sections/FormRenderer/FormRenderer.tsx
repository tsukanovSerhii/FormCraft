import { Lock, Send } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'
import { evaluateCondition } from '@/lib/conditions'
import type { Form } from '@/types/form'
import FieldInput from './FieldInput'

interface FormRendererProps {
  form: Form
  onSubmit: (data: Record<string, unknown>) => void
}

export default function FormRenderer({ form, onSubmit }: FormRendererProps) {
  const { handleSubmit, formState: { errors }, control } = useFormContext()
  const watchedValues = useWatch({ control }) as Record<string, unknown>

  return (
    <form onSubmit={handleSubmit(onSubmit as never)} className="flex flex-col gap-6 p-8">
      {form.fields.map((field, i) => {
        const visible = evaluateCondition(field.condition, watchedValues)
        if (!visible) return null
        return (
          <div key={field.id}>
            {i > 0 && <div className="mb-6 h-px bg-border" />}
            <label className="mb-2 block text-[13px] font-medium text-text-primary">
              {field.label}
              {field.required && <span className="ml-1 text-error">*</span>}
            </label>
            <FieldInput field={field} error={errors[field.id]?.message as string} />
            {errors[field.id] && (
              <p className="mt-1.5 text-[12px] text-error">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        )
      })}

      <div className="pt-2">
        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[14px] font-semibold text-white shadow-button transition-colors hover:bg-brand-dark"
        >
          Submit <Send size={14} />
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-text-muted">
          <Lock size={11} /> Your data is securely stored and private.
        </p>
      </div>
    </form>
  )
}
