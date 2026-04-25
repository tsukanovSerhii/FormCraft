import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { publicApi } from '@/api/public'
import { responsesApi } from '@/api/responses'
import { FormRenderer, SuccessScreen } from '@/components/sections/FormRenderer'
import { buildValidationSchema } from '@/schemas/fieldSchemas'
import type { ApiForm } from '@/types/api'
import type { FormField } from '@/types/form'

const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://formcraft.app'

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
          <rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
          <rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
          <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
        </svg>
      </div>
      <span className="text-[15px] font-bold tracking-tight text-text-primary">FormCraft</span>
    </div>
  )
}

export default function PublicFormPage() {
  const { formId } = useParams<{ formId: string }>()
  const [apiForm, setApiForm] = useState<ApiForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!formId) return
    publicApi.getForm(formId)
      .then(setApiForm)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [formId])

  const fields = (apiForm?.fields ?? []) as FormField[]
  const schema = apiForm ? buildValidationSchema(fields) : null

  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: fields.reduce((acc, f) => {
      acc[f.id] = f.type === 'checkbox' ? [] : (f.defaultValue ?? '')
      return acc
    }, {} as Record<string, unknown>),
  })

  async function onSubmit(data: Record<string, unknown>) {
    if (!formId) return
    try {
      await responsesApi.submit(formId, data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('expired') || msg.includes('maximum')) {
        setNotFound(true)
        return
      }
    }
    setSubmitted(true)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-secondary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    )
  }

  if (notFound || !apiForm) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-surface-secondary">
        <Logo />
        <p className="mt-4 text-lg font-semibold text-text-primary">Form not found</p>
        <p className="text-sm text-text-muted">This form may not be published or the link is incorrect.</p>
      </div>
    )
  }

  const now = Date.now()
  const canonicalUrl = `${SITE_URL}/f/${formId}`
  const pageTitle = `${apiForm.title} — FormCraft`
  const pageDescription = apiForm.description ?? `Fill out ${apiForm.title} — powered by FormCraft`

  return (
    <FormProvider {...methods}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:site_name" content="FormCraft" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* JSON-LD structured data */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: apiForm.title,
          description: pageDescription,
          url: canonicalUrl,
          publisher: { '@type': 'Organization', name: 'FormCraft', url: SITE_URL },
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-surface-secondary">
        {/* Branding header */}
        <header className="border-b border-border bg-surface px-6 py-3">
          <Logo />
        </header>

        <div className="px-6 py-10">
          <div className="mx-auto max-w-xl">
            {/* Form title */}
            <div className="mb-8 text-center">
              <h1 className="text-[28px] font-bold text-text-primary">{apiForm.title}</h1>
              {apiForm.description && (
                <p className="mt-2 text-[14px] text-text-secondary">{apiForm.description}</p>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-panel">
              <div className="h-1.5 bg-brand" />
              {submitted ? (
                <SuccessScreen
                  title={apiForm.title}
                  onReset={() => { setSubmitted(false); methods.reset() }}
                />
              ) : fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-text-muted">
                  <p className="text-[14px]">This form has no fields yet.</p>
                </div>
              ) : (
                <FormRenderer
                  form={{ ...apiForm, fields, description: apiForm.description ?? undefined, status: apiForm.status as 'draft' | 'published', responses: 0, createdAt: now, updatedAt: now }}
                  onSubmit={onSubmit}
                />
              )}
            </div>

            <p className="mt-8 text-center text-[12px] text-text-muted">
              Powered by <span className="font-bold text-text-secondary">FormCraft</span>
            </p>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
