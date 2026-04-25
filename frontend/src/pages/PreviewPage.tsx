import { zodResolver } from '@hookform/resolvers/zod'
import { HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { PreviewTopBar } from '@/components/preview'
import { FormRenderer, SuccessScreen } from '@/components/sections/FormRenderer'
import { buildValidationSchema } from '@/schemas/fieldSchemas'
import { useFormBuilderStore } from '@/store/formBuilderStore'
import { useResponsesStore } from '@/store/responsesStore'

export default function PreviewPage() {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const { forms } = useFormBuilderStore()
  const { addResponse } = useResponsesStore()
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [submitted, setSubmitted] = useState(false)

  const form = forms.find(f => f.id === formId)
  const schema = form ? buildValidationSchema(form.fields) : null

  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: form?.fields.reduce((acc, f) => {
      acc[f.id] = f.type === 'checkbox' ? [] : (f.defaultValue ?? '')
      return acc
    }, {} as Record<string, unknown>),
  })

  if (!form) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-surface-secondary">
        <p className="text-[16px] font-semibold text-text-primary">Form not found</p>
        <button
          onClick={() => navigate('/forms')}
          className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  function onSubmit(data: Record<string, unknown>) {
    addResponse(form!.id, form!.title, data)
    setSubmitted(true)
  }

  function handleReset() {
    methods.reset()
    setSubmitted(false)
  }

  return (
    <ErrorBoundary>
    <FormProvider {...methods}>
      <div className="flex min-h-screen flex-col bg-surface-secondary">
        <PreviewTopBar title={form.title} viewMode={viewMode} onViewModeChange={setViewMode} formId={formId} />

        <div className="flex-1 overflow-y-auto px-6 py-10">
          <div className={['mx-auto transition-all duration-300', viewMode === 'mobile' ? 'max-w-sm' : 'max-w-xl'].join(' ')}>
            <div className="mb-8 text-center">
              <h1 className="text-[28px] font-bold text-text-primary">{form.title}</h1>
              {form.description && (
                <p className="mt-2 text-[14px] text-text-secondary">{form.description}</p>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-panel">
              <div className="h-1.5 bg-brand" />
              {submitted ? (
                <SuccessScreen title={form.title} onReset={handleReset} />
              ) : form.fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-text-muted">
                  <p className="text-[14px]">This form has no fields yet.</p>
                </div>
              ) : (
                <FormRenderer form={form} onSubmit={onSubmit} />
              )}
            </div>

            <p className="mt-8 text-center text-[12px] text-text-muted">
              Powered by <span className="font-bold text-text-secondary">FormCraft</span>
            </p>
          </div>
        </div>

        <div className="fixed bottom-5 left-5 flex items-center gap-2 rounded-full bg-text-primary px-4 py-2 shadow-panel">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-[12px] font-semibold text-white">LIVE PREVIEW</span>
        </div>

        <button className="fixed bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-muted shadow-card transition-colors hover:text-text-primary">
          <HelpCircle size={16} />
        </button>
      </div>
    </FormProvider>
    </ErrorBoundary>
  )
}
