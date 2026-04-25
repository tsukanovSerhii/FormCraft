import { useState } from 'react'
import { SectionLabel } from '@/components/ui'

const FILE_TYPES = ['PDF', 'Image', 'Word', 'Excel', 'Any']

export default function FileConfig() {
	const [selected, setSelected] = useState<Set<string>>(new Set(['Any']))

	function toggle(type: string) {
		setSelected(prev => {
			const next = new Set(prev)
			if (type === 'Any') return new Set(['Any'])
			next.delete('Any')
			if (next.has(type)) { next.delete(type) } else { next.add(type) }
			if (next.size === 0) return new Set(['Any'])
			return next
		})
	}

	return (
		<div className="flex flex-col gap-2">
			<SectionLabel>Allowed Types</SectionLabel>
			<div className="flex flex-wrap gap-1.5">
				{FILE_TYPES.map(type => (
					<button
						key={type}
						onClick={() => toggle(type)}
						className={[
							'rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors',
							selected.has(type)
								? 'border-brand bg-brand-muted text-brand'
								: 'border-border text-text-secondary hover:border-brand-light',
						].join(' ')}
					>
						{type}
					</button>
				))}
			</div>
		</div>
	)
}
