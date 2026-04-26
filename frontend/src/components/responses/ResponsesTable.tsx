import { Eye } from 'lucide-react'
import type { FormResponse } from '@/store/responsesStore'

function formatDate(ts: number) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(ts)
}

function formatTime(ts: number) {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', hour12: true }).format(ts)
}

function initials(title: string) {
  return title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

interface Props {
  rows: FormResponse[]
  onView: (r: FormResponse) => void
}

export function ResponsesTable({ rows, onView }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface shadow-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['Date submitted', 'Form', 'Preview', 'Actions'].map(col => (
              <th key={col} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} className={i < rows.length - 1 ? 'border-b border-border' : ''}>
              <td className="px-5 py-4">
                <p className="text-[13px] font-medium text-text-primary">{formatDate(r.submittedAt)}</p>
                <p className="text-[12px] text-text-muted">{formatTime(r.submittedAt)}</p>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-muted text-[11px] font-bold text-brand">
                    {initials(r.formTitle)}
                  </span>
                  <span className="text-[13px] font-medium text-text-primary">{r.formTitle}</span>
                </div>
              </td>
              <td className="px-5 py-4 max-w-xs">
                <p className="truncate text-[12px] text-text-muted font-mono">
                  {Object.entries(r.data).slice(0, 2).map(([k, v]) => `${k}: ${String(v)}`).join(' · ')}
                </p>
              </td>
              <td className="px-5 py-4">
                <button
                  onClick={() => onView(r)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
                  title="View response"
                >
                  <Eye size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
