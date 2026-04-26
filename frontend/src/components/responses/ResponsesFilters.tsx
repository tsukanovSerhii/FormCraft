import { Search } from 'lucide-react'

interface UniqueForms {
  id: string
  title: string
}

interface Props {
  search: string
  formFilter: string
  dateFilter: string
  uniqueForms: UniqueForms[]
  onSearch: (v: string) => void
  onFormFilter: (v: string) => void
  onDateFilter: (v: string) => void
}

export function ResponsesFilters({ search, formFilter, dateFilter, uniqueForms, onSearch, onFormFilter, onDateFilter }: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search responses…"
          className="h-8 w-52 rounded-md border border-border bg-surface pl-8 pr-3 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none"
        />
      </div>

      <select
        value={formFilter}
        onChange={e => onFormFilter(e.target.value)}
        className="h-8 rounded-md border border-border bg-surface px-2.5 text-[13px] text-text-primary focus:border-brand focus:outline-none"
      >
        <option value="all">All forms</option>
        {uniqueForms.map(f => (
          <option key={f.id} value={f.id}>{f.title}</option>
        ))}
      </select>

      <select
        value={dateFilter}
        onChange={e => onDateFilter(e.target.value)}
        className="h-8 rounded-md border border-border bg-surface px-2.5 text-[13px] text-text-primary focus:border-brand focus:outline-none"
      >
        <option value="all">All time</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>
    </div>
  )
}
