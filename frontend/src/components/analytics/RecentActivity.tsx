import { formatRelativeDate } from '@/lib/utils'
import type { FormResponse } from '@/store/responsesStore'

const AVATAR_COLORS = [
  'bg-brand-muted text-brand',
  'bg-success-light text-success',
  'bg-danger-light text-danger',
]

function initials(title: string) {
  return title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

interface Props {
  responses: FormResponse[]
}

export function RecentActivity({ responses }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <p className="text-[14px] font-semibold text-text-primary">Recent Activity</p>
      </div>
      <div className="flex flex-col">
        {responses.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-[13px] text-text-muted">
            No recent activity.
          </div>
        ) : responses.map((r, i) => (
          <div key={r.id} className={['flex items-start gap-3 px-5 py-3.5', i < responses.length - 1 ? 'border-b border-border' : ''].join(' ')}>
            <span className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', AVATAR_COLORS[i % AVATAR_COLORS.length]].join(' ')}>
              {initials(r.formTitle)}
            </span>
            <div>
              <p className="text-[13px] font-medium text-text-primary">{r.formTitle}</p>
              <p className="text-[12px] text-text-muted">New response submitted</p>
              <p className="mt-0.5 text-[11px] text-text-placeholder">{formatRelativeDate(r.submittedAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
