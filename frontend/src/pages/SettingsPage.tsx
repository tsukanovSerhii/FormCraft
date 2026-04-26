import { useState } from 'react'
import { AppLayout } from '@/components/layouts'
import { ProfileTab } from '@/components/settings/ProfileTab'
import { SecurityTab } from '@/components/settings/SecurityTab'

type Tab = 'profile' | 'security'

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="border-b border-border px-8 pt-8">
          <h1 className="mb-4 text-xl font-bold text-text-primary">Settings</h1>
          <div className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'relative px-4 py-2 text-sm font-medium transition-colors',
                  tab === t.id
                    ? 'text-brand after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-brand'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto px-8 py-8">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'security' && <SecurityTab />}
        </div>
      </div>
    </AppLayout>
  )
}
