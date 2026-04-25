import { useEffect, useRef } from 'react'
import { useFormBuilderStore } from '@/store/formBuilderStore'

export function useAutoSave(formId: string | undefined, delay = 2000) {
  const { forms, syncForm } = useFormBuilderStore()
  const syncRef = useRef(syncForm)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevUpdatedAt = useRef<number | null>(null)

  useEffect(() => {
    syncRef.current = syncForm
  })

  useEffect(() => {
    if (!formId) return
    const form = forms.find(f => f.id === formId)
    if (!form) return

    if (prevUpdatedAt.current === null) {
      prevUpdatedAt.current = form.updatedAt
      return
    }

    if (form.updatedAt === prevUpdatedAt.current) return
    prevUpdatedAt.current = form.updatedAt

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      syncRef.current(formId)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [formId, forms, delay])
}
