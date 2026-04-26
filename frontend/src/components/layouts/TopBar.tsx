import { ArrowLeft, BookmarkPlus, Eye, HelpCircle, History, Settings2, Share2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { templatesApi } from '@/api/templates'
import { versionsApi, type FormVersion } from '@/api/versions'
import { Button, IconButton } from '@/components/ui'
import ShareModal from '@/components/ui/ShareModal'
import { useToast } from '@/components/ui/useToast'
import { NotificationCenter } from '@/components/ui/NotificationCenter'
import { useActiveForm } from '@/store/formBuilderStore'
import { TitleEditor } from './TitleEditor'
import { FormSettingsModal } from './FormSettingsModal'
import { VersionHistoryModal } from './VersionHistoryModal'
import { useFormBuilderStore } from '@/store/formBuilderStore'

export default function TopBar() {
	const form = useActiveForm()
	const { publishForm } = useFormBuilderStore()
	const navigate = useNavigate()
	const toast = useToast()

	const [shareOpen, setShareOpen] = useState(false)
	const [saving, setSaving] = useState(false)

	const [historyOpen, setHistoryOpen] = useState(false)
	const [versions, setVersions] = useState<FormVersion[]>([])
	const [versionsLoading, setVersionsLoading] = useState(false)

	const [formSettingsOpen, setFormSettingsOpen] = useState(false)
	const [expiresAt, setExpiresAt] = useState('')
	const [maxResponses, setMaxResponses] = useState('')

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
					<TitleEditor form={form} />
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
				<FormSettingsModal
					form={form}
					expiresAt={expiresAt}
					maxResponses={maxResponses}
					onExpiresAtChange={setExpiresAt}
					onMaxResponsesChange={setMaxResponses}
					onClose={() => setFormSettingsOpen(false)}
				/>
			)}

			{historyOpen && (
				<VersionHistoryModal
					formId={form?.id ?? ''}
					versions={versions}
					loading={versionsLoading}
					onClose={() => setHistoryOpen(false)}
					onRestore={handleRestore}
				/>
			)}
		</>
	)
}
