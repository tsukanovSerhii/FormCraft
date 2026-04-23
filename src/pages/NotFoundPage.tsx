import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

export default function NotFoundPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-surface-secondary px-6">
			{/* Big 404 */}
			<div className="relative select-none">
				<p className="text-[160px] font-black leading-none tracking-tighter text-border">
					404
				</p>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand shadow-button">
						<svg width="28" height="28" viewBox="0 0 16 16" fill="none">
							<rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
							<rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
							<rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
							<rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
						</svg>
					</div>
				</div>
			</div>

			<h1 className="mt-4 text-[24px] font-bold text-text-primary">Page not found</h1>
			<p className="mt-2 max-w-xs text-center text-[14px] text-text-muted">
				The page you're looking for doesn't exist or has been moved.
			</p>

			<Link
				to="/"
				className="mt-8 flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-button transition-colors hover:bg-brand-dark"
			>
				<ArrowLeft size={14} />
				Back to Dashboard
			</Link>
		</div>
	)
}
