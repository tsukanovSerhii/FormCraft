import { ArrowLeft, Bell, BookmarkPlus, Eye, HelpCircle, Share2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { templatesApi } from '@/api/templates'
import { Button, IconButton } from '@/components/ui'
import ShareModal from '@/components/ui/ShareModal'
import { useToast } from '@/components/ui/Toast'
import { useActiveForm, useFormBuilderStore } from '@/store/formBuilderStore'

export default function TopBar() {
	const form = useActiveForm()
	const { updateFormTitle, publishForm } = useFormBuilderStore()
	const navigate = useNavigate()
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState('')
	const [shareOpen, setShareOpen] = useState(false)
	const [saving, setSaving] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const toast = useToast()

	function startEditing() {
		setDraft(form?.title ?? '')
		setEditing(true)
		setTimeout(() => inputRef.current?.select(), 0)
	}

	function commit() {
		if (form && draft.trim()) updateFormTitle(form.id, draft.trim())
		setEditing(false)
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'Enter') commit()
		if (e.key === 'Escape') setEditing(false)
	}

	async function handleSaveTemplate() {
		if (!form) return
		setSaving(true)
		try {
			await templatesApi.create({
				title: form.title,
				description: form.description,
				category: 'Custom',
				fields: form.fields,
			})
			toast.success(`"${form.title}" saved as template`)
		} catch {
			toast.error('Failed to save template')
		} finally {
			setSaving(false)
		}
	}

	return (
		<>
			<header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
				<div className="flex items-center gap-3">
					<button
						onClick={() => navigate('/forms')}
						className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
					>
						<ArrowLeft size={16} />
					</button>
					{editing ? (
						<input
							ref={inputRef}
							value={draft}
							onChange={e => setDraft(e.target.value)}
							onBlur={commit}
							onKeyDown={handleKeyDown}
							className="rounded-md border border-brand bg-surface-secondary px-2 py-1 text-[14px] font-semibold text-text-primary outline-none"
							style={{ minWidth: 120, width: `${Math.max(draft.length, 10)}ch` }}
						/>
					) : (
						<button
							onClick={startEditing}
							className="rounded-md px-2 py-1 text-[14px] font-semibold text-text-primary hover:bg-surface-secondary"
							title="Click to rename"
						>
							{form?.title ?? 'Untitled Form'}
						</button>
					)}
				</div>

				<div className="flex items-center gap-2">
					<IconButton><HelpCircle size={17} /></IconButton>
					<IconButton><Bell size={17} /></IconButton>

					<div className="mx-2 h-5 w-px bg-border" />

					<Button
						variant="outline"
						size="sm"
						icon={<Eye size={14} />}
						onClick={() => navigate(`/preview/${form?.id}`)}
					>
						Preview
					</Button>
					<IconButton
						onClick={handleSaveTemplate}
						disabled={saving || !form}
						title="Save as template"
					>
						<BookmarkPlus size={16} />
					</IconButton>
					<Button
						variant="outline"
						size="sm"
						icon={<Share2 size={14} />}
						onClick={() => setShareOpen(true)}
						disabled={form?.status !== 'published'}
						title={form?.status !== 'published' ? 'Publish the form first to share it' : undefined}
					>
						Share
					</Button>
					<Button
						variant="primary"
						size="sm"
						onClick={() => form && publishForm(form.id)}
					>
						{form?.status === 'published' ? 'Published ✓' : 'Publish'}
					</Button>
				</div>
			</header>

			{shareOpen && form && (
				<ShareModal
					formId={form.id}
					formTitle={form.title}
					onClose={() => setShareOpen(false)}
				/>
			)}
		</>
	)
}
