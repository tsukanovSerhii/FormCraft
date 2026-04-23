import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BuilderLayout } from '@/components/layouts'
import { FormCanvas, SettingsPanel } from '@/components/sections'
import { useFormBuilderStore } from '@/store/formBuilderStore'

export default function BuilderPage() {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const { forms, setActiveForm } = useFormBuilderStore()

  useEffect(() => {
    if (!formId) return
    const exists = forms.some(f => f.id === formId)
    if (!exists) {
      navigate('/forms', { replace: true })
      return
    }
    setActiveForm(formId)
  }, [formId])

  return (
    <BuilderLayout
      canvas={<FormCanvas />}
      settingsPanel={<SettingsPanel />}
    />
  )
}
