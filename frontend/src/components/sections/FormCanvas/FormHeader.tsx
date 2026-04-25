import { Pencil } from 'lucide-react'
import { useRef, useState } from 'react'
import { useActiveForm, useFormBuilderStore } from '@/store/formBuilderStore'

function EditableField({
	value,
	placeholder,
	onCommit,
	textClass,
	inputClass,
}: {
	value: string
	placeholder: string
	onCommit: (val: string) => void
	textClass: string
	inputClass: string
}) {
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	function startEditing() {
		setDraft(value)
		setEditing(true)
		setTimeout(() => {
			const el = inputRef.current
			if (!el) return
			el.focus()
			el.setSelectionRange(el.value.length, el.value.length)
		}, 0)
	}

	function commit() {
		onCommit(draft.trim())
		setEditing(false)
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'Enter') commit()
		if (e.key === 'Escape') setEditing(false)
	}

	if (editing) {
		return (
			<input
				ref={inputRef}
				value={draft}
				onChange={e => setDraft(e.target.value)}
				onBlur={commit}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className={inputClass}
			/>
		)
	}

	return (
		<button
			onClick={startEditing}
			className="group flex items-center gap-2 text-left"
		>
			<span className={textClass}>{value || <span className="opacity-40">{placeholder}</span>}</span>
			<Pencil
				size={13}
				className="shrink-0 opacity-0 transition-opacity group-hover:opacity-40"
			/>
		</button>
	)
}

export default function FormHeader() {
	const form = useActiveForm()
	const { updateFormTitle, updateFormDescription } = useFormBuilderStore()

	if (!form) return null

	return (
		<div className="rounded-lg border border-border bg-surface p-6 shadow-card">
			<div className="border-l-4 border-brand pl-4">
				<EditableField
					value={form.title}
					placeholder="Untitled Form"
					onCommit={val => val && updateFormTitle(form.id, val)}
					textClass="text-[22px] font-bold text-text-primary"
					inputClass="w-full bg-transparent text-[22px] font-bold text-text-primary outline-none"
				/>
				<div className="mt-1">
					<EditableField
						value={form.description ?? ''}
						placeholder="Add a description..."
						onCommit={val => updateFormDescription(form.id, val)}
						textClass="text-[14px] text-text-placeholder"
						inputClass="w-full bg-transparent text-[14px] text-text-placeholder outline-none placeholder:text-text-placeholder"
					/>
				</div>
			</div>
		</div>
	)
}
