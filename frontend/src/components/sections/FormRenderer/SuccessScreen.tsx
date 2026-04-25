import { CheckCircle2 } from 'lucide-react'

interface SuccessScreenProps {
  title: string
  onReset: () => void
}

export default function SuccessScreen({ title, onReset }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-light text-success">
        <CheckCircle2 size={32} />
      </div>
      <h2 className="mt-5 text-[20px] font-bold text-text-primary">Response submitted!</h2>
      <p className="mt-2 text-[13px] text-text-muted">
        Thank you for filling out <span className="font-medium">{title}</span>.
      </p>
      <button
        onClick={onReset}
        className="mt-6 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-secondary"
      >
        Submit another response
      </button>
    </div>
  )
}
