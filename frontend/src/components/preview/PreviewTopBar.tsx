import { ArrowLeft, Monitor, Share2, Smartphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PreviewTopBarProps {
	title: string
	viewMode: 'desktop' | 'mobile'
	onViewModeChange: (mode: 'desktop' | 'mobile') => void
	formId?: string
}

export default function PreviewTopBar({ title, viewMode, onViewModeChange, formId }: PreviewTopBarProps) {
	const navigate = useNavigate()

	return (
		<header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
			<div className="flex items-center gap-3">
				<button
					onClick={() => navigate(formId ? `/builder/${formId}` : '/forms')}
					className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
				>
					<ArrowLeft size={16} />
				</button>
				<button onClick={() => navigate('/forms')} className="flex items-center gap-2">
					<div className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand">
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
							<rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
							<rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
							<rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
						</svg>
					</div>
					<span className="text-[14px] font-semibold text-text-primary">{title}</span>
				</button>
			</div>

			{/* Desktop / Mobile toggle */}
			<div className="flex items-center gap-1 rounded-md border border-border p-0.5">
				<button
					onClick={() => onViewModeChange('desktop')}
					className={[
						'flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium transition-colors',
						viewMode === 'desktop'
							? 'bg-surface-secondary text-text-primary'
							: 'text-text-muted hover:text-text-secondary',
					].join(' ')}
				>
					<Monitor size={13} /> Desktop
				</button>
				<button
					onClick={() => onViewModeChange('mobile')}
					className={[
						'flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium transition-colors',
						viewMode === 'mobile'
							? 'bg-surface-secondary text-text-primary'
							: 'text-text-muted hover:text-text-secondary',
					].join(' ')}
				>
					<Smartphone size={13} /> Mobile
				</button>
			</div>

			<div className="flex items-center gap-2">
				<button className="flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-[13px] font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary">
					<Share2 size={13} /> Share
				</button>
				<button className="h-8 rounded-md bg-brand px-3 text-[13px] font-medium text-white shadow-button transition-colors hover:bg-brand-dark">
					Publish
				</button>
			</div>
		</header>
	)
}
