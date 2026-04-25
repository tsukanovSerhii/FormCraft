interface StatusBadgeProps {
	status: 'published' | 'draft'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
	return (
		<span className={[
			'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
			status === 'published' ? 'bg-success-light text-success' : 'bg-surface-tertiary text-text-muted',
		].join(' ')}>
			{status === 'published' ? 'Published' : 'Draft'}
		</span>
	)
}
