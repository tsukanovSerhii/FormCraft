import { Star } from 'lucide-react'

interface StarRatingProps {
	score: number
	max?: number
}

export default function StarRating({ score, max = 5 }: StarRatingProps) {
	return (
		<div className="flex items-center gap-1">
			{Array.from({ length: max }, (_, i) => i + 1).map(i => (
				<Star
					key={i}
					size={13}
					className={i <= score ? 'fill-[#ffa502] text-[#ffa502]' : 'fill-border text-border'}
				/>
			))}
			<span className="ml-1 text-[13px] font-medium text-text-secondary">{score}.0</span>
		</div>
	)
}
