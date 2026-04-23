import { useState } from 'react'
import { HelpCircle, Lock, Send } from 'lucide-react'
import { FormSectionHeader, PreviewTopBar } from '@/components/preview'

const RATING_OPTIONS = ['Poor', 'Average', 'Great', 'Exceptional']
const FEATURES = ['Logic Builder', 'Dynamic Theming', 'Analytics Export', 'Collaborative Editing']

export default function PreviewPage() {
	const [rating, setRating] = useState<string | null>('Great')
	const [features, setFeatures] = useState<Set<string>>(new Set(['Dynamic Theming', 'Analytics Export']))

	function toggleFeature(f: string) {
		setFeatures(prev => {
			const next = new Set(prev)
			next.has(f) ? next.delete(f) : next.add(f)
			return next
		})
	}

	return (
		<div className="flex min-h-screen flex-col bg-surface-secondary">
			<PreviewTopBar title="Customer Feedback" />

			<div className="flex-1 overflow-y-auto px-6 py-10">
				{/* Title */}
				<div className="mb-8 text-center">
					<h1 className="text-[32px] font-bold text-text-primary">Customer Feedback</h1>
					<p className="mt-2 text-[15px] text-text-secondary">
						Help us improve your experience. Your feedback is essential for our growth.
					</p>
				</div>

				{/* Form card */}
				<div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-panel">
					<div className="h-1.5 bg-brand" />

					<div className="flex flex-col gap-8 p-8">
						{/* Personal Details */}
						<section>
							<FormSectionHeader
								title="Personal Details"
								icon={
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								}
							/>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="mb-1.5 block text-[12px] font-medium text-text-secondary">Full Name</label>
									<input
										type="text"
										placeholder="Alex Johnson"
										className="h-10 w-full rounded-lg border border-border bg-surface-secondary px-3 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none"
									/>
								</div>
								<div>
									<label className="mb-1.5 block text-[12px] font-medium text-text-secondary">Email Address</label>
									<input
										type="email"
										placeholder="alex@example.com"
										className="h-10 w-full rounded-lg border border-border bg-surface-secondary px-3 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none"
									/>
								</div>
							</div>
						</section>

						<div className="h-px bg-border" />

						{/* Experience Rating */}
						<section>
							<FormSectionHeader
								title="Experience Rating"
								icon={
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
									</svg>
								}
							/>
							<p className="mb-4 text-[12px] italic text-text-muted">How would you rate your overall satisfaction with FormCraft?</p>
							<div className="flex gap-2">
								{RATING_OPTIONS.map(opt => (
									<button
										key={opt}
										onClick={() => setRating(opt)}
										className={[
											'flex-1 rounded-lg border py-2 text-[13px] font-medium transition-all',
											rating === opt
												? 'border-brand bg-brand text-white'
												: 'border-border bg-surface-secondary text-text-secondary hover:border-brand-light hover:text-text-primary',
										].join(' ')}
									>
										{opt}
									</button>
								))}
							</div>
						</section>

						<div className="h-px bg-border" />

						{/* Features Used */}
						<section>
							<FormSectionHeader
								title="Features Used"
								icon={
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
										<line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
									</svg>
								}
							/>
							<div className="grid grid-cols-2 gap-2.5">
								{FEATURES.map(f => {
									const checked = features.has(f)
									return (
										<button
											key={f}
											onClick={() => toggleFeature(f)}
											className={[
												'flex items-center gap-2.5 rounded-lg border p-3 text-left text-[13px] font-medium transition-all',
												checked
													? 'border-brand-light bg-brand-muted text-brand'
													: 'border-border bg-surface-secondary text-text-secondary hover:border-border-strong',
											].join(' ')}
										>
											<span className={[
												'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
												checked ? 'border-brand bg-brand' : 'border-border-strong bg-surface',
											].join(' ')}>
												{checked && (
													<svg width="9" height="7" viewBox="0 0 9 7" fill="none">
														<path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												)}
											</span>
											{f}
										</button>
									)
								})}
							</div>
						</section>

						<div className="h-px bg-border" />

						{/* Additional Comments */}
						<section>
							<FormSectionHeader
								title="Additional Comments"
								icon={
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
									</svg>
								}
							/>
							<textarea
								rows={4}
								placeholder="Tell us more about your experience..."
								className="w-full resize-none rounded-lg border border-border bg-surface-secondary px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-placeholder focus:border-brand focus:outline-none"
							/>
						</section>

						{/* Submit */}
						<div>
							<button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[14px] font-semibold text-white shadow-button transition-colors hover:bg-brand-dark">
								Submit Feedback
								<Send size={14} />
							</button>
							<p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-text-muted">
								<Lock size={11} />
								Your data is securely stored and private.
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<p className="mt-8 text-center text-[12px] text-text-muted">
					Powered by{' '}
					<span className="font-bold text-text-secondary">FormCraft</span>
					{' · '}
					<a href="#" className="hover:underline">Privacy Policy</a>
				</p>
			</div>

			{/* Live preview badge */}
			<div className="fixed bottom-5 left-5 flex items-center gap-2 rounded-full bg-text-primary px-4 py-2 shadow-panel">
				<span className="h-2 w-2 rounded-full bg-success" />
				<span className="text-[12px] font-semibold text-white">LIVE PREVIEW</span>
			</div>

			{/* Help button */}
			<button className="fixed bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-muted shadow-card transition-colors hover:text-text-primary">
				<HelpCircle size={16} />
			</button>
		</div>
	)
}
