import { ArrowLeft, BookmarkPlus, Eye, HelpCircle, History, Settings2, Share2 } from 'lucide-react'
import { NotificationCenter } from '@/components/ui/NotificationCenter'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { templatesApi } from '@/api/templates'
import { versionsApi, type FormVersion } from '@/api/versions'
import { Button, IconButton } from '@/components/ui'
import ShareModal from '@/components/ui/ShareModal'
import { useToast } from '@/components/ui/useToast'
import { useActiveForm, useFormBuilderStore } from '@/store/formBuilderStore'

export default function TopBar() {
	const form = useActiveForm()
	const { updateFormTitle, publishForm, updateFormSettings } = useFormBuilderStore()
	const navigate = useNavigate()
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState('')
	const [shareOpen, setShareOpen] = useState(false)
	const [saving, setSaving] = useState(false)
	const [historyOpen, setHistoryOpen] = useState(false)
	const [versions, setVersions] = useState<FormVersion[]>([])
	const [versionsLoading, setVersionsLoading] = useState(false)
	const [formSettingsOpen, setFormSettingsOpen] = useState(false)
	const [expiresAt, setExpiresAt] = useState('')
	const [maxResponses, setMaxResponses] = useState('')
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

	async function openHistory() {
		if (!form) return
		setHistoryOpen(true)
		setVersionsLoading(true)
		try {
			setVersions(await versionsApi.getAll(form.id))
		} catch {
			toast.error('Failed to load history')
		} finally {
			setVersionsLoading(false)
		}
	}

	async function handleRestore(versionId: string) {
		if (!form) return
		try {
			await versionsApi.restore(form.id, versionId)
			toast.success('Version restored — reload to see changes')
			setHistoryOpen(false)
		} catch {
			toast.error('Failed to restore version')
		}
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
					<NotificationCenter />
					<IconButton onClick={openHistory} title="Version history" disabled={!form}>
						<History size={16} />
					</IconButton>
					<IconButton
						onClick={() => {
							setExpiresAt(form?.expiresAt ? form.expiresAt.slice(0, 10) : '')
							setMaxResponses(form?.maxResponses ? String(form.maxResponses) : '')
							setFormSettingsOpen(true)
						}}
						title="Form settings"
						disabled={!form}
					>
						<Settings2 size={16} />
					</IconButton>

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

			{formSettingsOpen && form && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
					<div className="w-full max-w-sm rounded-2xl border border-border bg-surface shadow-panel">
						<div className="flex items-center justify-between border-b border-border px-5 py-4">
							<p className="text-[15px] font-semibold text-text-primary">Form Settings</p>
							<button onClick={() => setFormSettingsOpen(false)} className="text-text-muted hover:text-text-primary">✕</button>
						</div>
						<div className="flex flex-col gap-5 p-5">
							<div className="flex flex-col gap-1.5">
								<label className="text-[12px] font-medium text-text-secondary">Expiry date</label>
								<input
									type="date"
									value={expiresAt}
									onChange={e => setExpiresAt(e.target.value)}
									className="h-9 rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-brand focus:outline-none"
								/>
								<p className="text-[11px] text-text-muted">Form stops accepting responses after this date.</p>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-[12px] font-medium text-text-secondary">Max responses</label>
								<input
									type="number"
									min={1}
									value={maxResponses}
									onChange={e => setMaxResponses(e.target.value)}
									placeholder="Unlimited"
									className="h-9 rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-brand focus:outline-none"
								/>
								<p className="text-[11px] text-text-muted">Close the form automatically after this many responses.</p>
							</div>
						</div>
						<div className="flex gap-2 border-t border-border px-5 py-4">
							<button
								onClick={() => setFormSettingsOpen(false)}
								className="flex-1 rounded-md border border-border py-2 text-[13px] font-medium text-text-secondary transition-colors hover:border-border-strong"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									updateFormSettings(form.id, {
										expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
										maxResponses: maxResponses ? parseInt(maxResponses) : null,
									})
									setFormSettingsOpen(false)
									toast.success('Settings saved')
								}}
								className="flex-1 rounded-md bg-brand py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			{historyOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
					<div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-panel">
						<div className="flex items-center justify-between border-b border-border px-5 py-4">
							<p className="text-[15px] font-semibold text-text-primary">Version History</p>
							<button onClick={() => setHistoryOpen(false)} className="text-text-muted hover:text-text-primary">✕</button>
						</div>
						<div className="max-h-80 overflow-y-auto">
							{versionsLoading ? (
								<div className="flex items-center justify-center py-10">
									<div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
								</div>
							) : versions.length === 0 ? (
								<p className="py-10 text-center text-[13px] text-text-muted">
									No versions yet. Versions are saved when you publish a form.
								</p>
							) : versions.map(v => (
								<div key={v.id} className="flex items-center justify-between border-b border-border px-5 py-3.5 last:border-0">
									<div>
										<p className="text-[13px] font-medium text-text-primary">v{v.version} — {v.title}</p>
										<p className="text-[11px] text-text-muted">{new Date(v.createdAt).toLocaleString()}</p>
									</div>
									<button
										onClick={() => handleRestore(v.id)}
										className="rounded-md border border-border px-3 py-1 text-[12px] font-medium text-text-secondary transition-colors hover:border-brand hover:text-brand"
									>
										Restore
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	)
}
