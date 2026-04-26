import { formatRelativeDate } from '@/lib/utils'

interface FormRow {
  name: string
  responses: number
  status: string
  updatedAt: number
}

interface Props {
  forms: FormRow[]
  days: number
}

export function TopFormsTable({ forms, days }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <p className="text-[14px] font-semibold text-text-primary">Top-performing Forms</p>
        <span className="text-[12px] text-text-muted">{days}-day window</span>
      </div>
      {forms.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-[13px] text-text-muted">
          No responses collected yet.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['FORM NAME', 'RESPONSES', 'STATUS', 'LAST UPDATED'].map(col => (
                <th key={col} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {forms.map((f, i) => (
              <tr key={f.name} className={i < forms.length - 1 ? 'border-b border-border' : ''}>
                <td className="px-5 py-3.5 text-[13px] font-medium text-text-primary">{f.name}</td>
                <td className="px-5 py-3.5 text-[13px] text-text-secondary">{f.responses}</td>
                <td className="px-5 py-3.5">
                  <span className={[
                    'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                    f.status === 'published' ? 'bg-success-light text-success' : 'bg-surface-secondary text-text-muted',
                  ].join(' ')}>
                    {f.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[12px] text-text-muted">{formatRelativeDate(f.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
