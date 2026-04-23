import { Search } from 'lucide-react'
import { AppLayout } from '@/components/layouts'
import { TEMPLATE_CATEGORIES, TEMPLATES } from '@/data/templates'

export default function TemplatesPage() {
	return (
		<AppLayout>
			<div className="px-8 py-8">
				{/* Header */}
				<div className="mb-6">
					<h1 className="text-[22px] font-bold text-text-primary">Templates</h1>
					<p className="mt-0.5 text-[13px] text-text-muted">Start from a pre-built form to save time</p>
				</div>

				{/* Search + filter */}
				<div className="mb-6 flex items-center gap-3">
					<div className="relative max-w-sm flex-1">
						<input
							type="text"
							placeholder="Search templates..."
							className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none"
						/>
						<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
					</div>
					<div className="flex gap-1">
						{TEMPLATE_CATEGORIES.map(cat => (
							<button
								key={cat}
								className={[
									'rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
									cat === 'All' ? 'bg-brand text-white' : 'border border-border text-text-secondary hover:border-border-strong hover:text-text-primary',
								].join(' ')}
							>
								{cat}
							</button>
						))}
					</div>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-3 gap-4">
					{TEMPLATES.map(t => (
						<div
							key={t.id}
							className="group flex flex-col rounded-lg border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-panel"
						>
							<div className={['mb-4 flex h-10 w-10 items-center justify-center rounded-md', t.color].join(' ')}>
								<t.icon size={18} />
							</div>
							<p className="text-[14px] font-semibold text-text-primary">{t.title}</p>
							<p className="mt-1 text-[12px] text-text-muted">{t.fields} fields · {t.category}</p>
							<button className="mt-4 h-8 w-full rounded-md border border-border text-[13px] font-medium text-text-secondary opacity-0 transition-all group-hover:border-brand group-hover:text-brand group-hover:opacity-100">
								Use Template
							</button>
						</div>
					))}
				</div>
			</div>
		</AppLayout>
	)
}
