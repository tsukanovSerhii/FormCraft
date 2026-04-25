import { templatesApi, type UserTemplate } from '@/api/templates'
import { AppLayout } from '@/components/layouts'
import { useToast } from '@/components/ui/Toast'
import { TEMPLATE_CATEGORIES, TEMPLATES } from '@/data/templates'
import { useTemplate } from '@/hooks'
import { FileText, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TemplatesPage() {
	const [query, setQuery] = useState('')
	const [activeCategory, setActiveCategory] = useState('All')
	const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([])
	const { applyTemplate } = useTemplate()
	const toast = useToast()

	useEffect(() => {
		templatesApi
			.getAll()
			.then(setUserTemplates)
			.catch(() => {})
	}, [])

	async function handleDelete(id: string) {
		await templatesApi.delete(id)
		setUserTemplates(prev => prev.filter(t => t.id !== id))
		toast.success('Template deleted')
	}

	async function applyUserTemplate(t: UserTemplate) {
		await applyTemplate({
			id: t.id,
			title: t.title,
			description: t.description ?? '',
			category: t.category,
			icon: FileText,
			color: 'bg-brand-muted text-brand',
			fields: t.fields as any
		})
	}

	const allCategories = ['All', ...TEMPLATE_CATEGORIES.filter(c => c !== 'All')]

	const filteredBuiltin = TEMPLATES.filter(t => {
		const matchCat = activeCategory === 'All' || t.category === activeCategory
		const matchQ = t.title.toLowerCase().includes(query.toLowerCase())
		return matchCat && matchQ
	})

	const filteredUser = userTemplates.filter(t => {
		const matchCat =
			activeCategory === 'All' ||
			activeCategory === 'Custom' ||
			t.category === activeCategory
		const matchQ = t.title.toLowerCase().includes(query.toLowerCase())
		return matchCat && matchQ
	})

	return (
		<AppLayout>
			<div className="px-8 py-8">
				<div className="mb-6">
					<h1 className="text-[22px] font-bold text-text-primary">Templates</h1>
					<p className="mt-0.5 text-[13px] text-text-muted">
						Start from a pre-built form or use one you saved
					</p>
				</div>

				{/* Search + category filter */}
				<div className="mb-6 flex flex-wrap items-center gap-3">
					<div className="relative max-w-sm flex-1">
						<input
							type="text"
							value={query}
							onChange={e => setQuery(e.target.value)}
							placeholder="Search templates..."
							className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none"
						/>
						<Search
							size={14}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
						/>
					</div>
					<div className="flex flex-wrap gap-1">
						{[...allCategories, 'Custom'].map(cat => (
							<button
								key={cat}
								onClick={() => setActiveCategory(cat)}
								className={[
									'rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
									cat === activeCategory
										? 'bg-brand text-white'
										: 'border border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
								].join(' ')}
							>
								{cat}
							</button>
						))}
					</div>
				</div>

				{/* My Templates */}
				{filteredUser.length > 0 && (
					<div className="mb-8">
						<h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-text-muted">
							My Templates
						</h2>
						<div className="grid grid-cols-3 gap-4">
							{filteredUser.map(t => (
								<div
									key={t.id}
									className="group flex flex-col rounded-lg border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-panel"
								>
									<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-brand-muted text-brand">
										<FileText size={18} />
									</div>
									<p className="text-[14px] font-semibold text-text-primary">
										{t.title}
									</p>
									{t.description && (
										<p className="mt-1 text-[12px] text-text-muted">
											{t.description}
										</p>
									)}
									<p className="mt-1.5 text-[11px] text-text-placeholder">
										{(t.fields as unknown[]).length} fields · {t.category}
									</p>
									<div className="mt-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
										<button
											onClick={() => applyUserTemplate(t)}
											className="h-8 flex-1 rounded-md border border-brand text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white"
										>
											Use Template
										</button>
										<button
											onClick={() => handleDelete(t.id)}
											className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:border-red-300 hover:text-red-500"
										>
											<Trash2 size={13} />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Built-in Templates */}
				{filteredBuiltin.length > 0 && (
					<div>
						{filteredUser.length > 0 && (
							<h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-text-muted">
								Built-in
							</h2>
						)}
						<div className="grid grid-cols-3 gap-4">
							{filteredBuiltin.map(t => (
								<div
									key={t.id}
									className="group flex flex-col rounded-lg border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-panel"
								>
									<div
										className={[
											'mb-4 flex h-10 w-10 items-center justify-center rounded-md',
											t.color
										].join(' ')}
									>
										<t.icon size={18} />
									</div>
									<p className="text-[14px] font-semibold text-text-primary">
										{t.title}
									</p>
									<p className="mt-1 text-[12px] text-text-muted">
										{t.description}
									</p>
									<p className="mt-1.5 text-[11px] text-text-placeholder">
										{t.fields.length} fields · {t.category}
									</p>
									<button
										onClick={() => applyTemplate(t)}
										className="mt-4 h-8 w-full rounded-md border border-border text-[13px] font-medium text-text-secondary opacity-0 transition-all group-hover:border-brand group-hover:text-brand group-hover:opacity-100"
									>
										Use Template
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{filteredBuiltin.length === 0 && filteredUser.length === 0 && (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<p className="text-[15px] font-semibold text-text-primary">
							No templates found
						</p>
						<p className="mt-1 text-[13px] text-text-muted">
							Try a different search or category.
						</p>
					</div>
				)}
			</div>
		</AppLayout>
	)
}
