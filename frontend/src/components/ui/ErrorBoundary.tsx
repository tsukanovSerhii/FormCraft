import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  reset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-secondary p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <RefreshCw size={24} />
          </div>
          <h1 className="text-[20px] font-bold text-text-primary">Something went wrong</h1>
          <p className="max-w-sm text-[13px] text-text-muted">
            An unexpected error occurred. Try refreshing the page.
          </p>
          {this.state.error && (
            <pre className="mt-2 max-w-md overflow-auto rounded-lg border border-border bg-surface p-4 text-left text-[11px] text-text-muted">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3">
            <button
              onClick={this.reset}
              className="flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-4 text-[13px] font-medium text-text-primary transition-colors hover:border-border-strong"
            >
              <RefreshCw size={13} /> Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex h-9 items-center gap-2 rounded-md bg-brand px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
