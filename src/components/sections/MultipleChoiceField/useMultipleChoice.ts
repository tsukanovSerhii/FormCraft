import { useState } from 'react'

export function useMultipleChoice() {
	const [selected, setSelected] = useState<string | null>(null)

	function toggle(option: string) {
		setSelected(prev => (prev === option ? null : option))
	}

	return { selected, toggle }
}
