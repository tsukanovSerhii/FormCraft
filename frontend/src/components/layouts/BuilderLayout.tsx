import { type ReactNode } from 'react'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface BuilderLayoutProps {
  canvas: ReactNode
  settingsPanel: ReactNode
}

export default function BuilderLayout({ canvas, settingsPanel }: BuilderLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-surface-secondary">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />

          <div className="flex min-h-0 flex-1">
            <main className="flex-1 overflow-y-auto px-8 py-6">
              {canvas}
            </main>

            <aside className="flex w-70 shrink-0 flex-col overflow-y-auto border-l border-border bg-surface">
              {settingsPanel}
            </aside>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
