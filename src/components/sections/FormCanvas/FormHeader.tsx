import { useActiveForm } from '@/store/formBuilderStore'

export default function FormHeader() {
	const form = useActiveForm()

	return (
		<div className="rounded-lg border border-border bg-surface p-6 shadow-card">
			<div className="border-l-4 border-brand pl-4">
				<h1 className="text-[22px] font-bold text-text-primary">{form?.title ?? 'Untitled Form'}</h1>
				<p className="mt-1 text-[14px] text-text-placeholder">Form description (optional)</p>
			</div>
		</div>
	)
}
