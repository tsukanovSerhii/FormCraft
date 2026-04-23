import { BuilderLayout } from '@/components/layouts'
import { FormCanvas, SettingsPanel } from '@/components/sections'

export default function BuilderPage() {
  return (
    <BuilderLayout
      canvas={<FormCanvas />}
      settingsPanel={<SettingsPanel />}
    />
  )
}
