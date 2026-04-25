import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BuilderLayout } from '@/components/layouts'
import { FormCanvas, SettingsPanel } from '@/components/sections'
import { useAutoSave } from '@/hooks'
import { useFormBuilderStore } from '@/store/formBuilderStore'

export default function BuilderPage() {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const { forms, setActiveForm, syncForm } = useFormBuilderStore()
  const syncRef = useRef(syncForm)
  syncRef.current = syncForm

  useAutoSave(formId)

  useEffect(() => {
    if (!formId) return
    const exists = forms.some(f => f.id === formId)
    if (!exists) {
      navigate('/forms', { replace: true })
      return
    }
    setActiveForm(formId)

    return () => { syncRef.current(formId) }
  }, [formId])

  return (
    <BuilderLayout
      canvas={<FormCanvas />}
      settingsPanel={<SettingsPanel />}
    />
  )
}
