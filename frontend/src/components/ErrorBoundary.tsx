import { Component, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: { componentStack: string }) => void
  resetKey?: unknown
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorId: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}`,
    }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary] Caught:', error.message, info.componentStack)
    this.props.onError?.(error, info)
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null, errorId: '' })
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorId: '' })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.fallback) return this.props.fallback

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'var(--bg, #000)' }}
        role="alert"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <h1 className="text-white font-black text-xl mb-2">Something went wrong</h1>
        <p className="text-zinc-500 text-sm mb-1 max-w-xs leading-relaxed">
          An unexpected error occurred. Your data is safe.
        </p>
        {import.meta.env.DEV && this.state.error && (
          <p className="text-zinc-700 text-xs font-mono mt-2 max-w-xs break-all">
            {this.state.error.message}
          </p>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={this.reset}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={14} />
            Try again
          </button>
          <button
            onClick={() => { window.location.href = '/' }}
            className="px-5 py-3 rounded-2xl border border-white/10 text-zinc-400 text-sm font-semibold hover:text-white transition-colors"
          >
            Go home
          </button>
        </div>
        <p className="text-zinc-800 text-[10px] font-mono mt-8">{this.state.errorId}</p>
      </div>
    )
  }
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode,
) {
  const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'

  function WithBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }

  WithBoundary.displayName = `withErrorBoundary(${displayName})`
  return WithBoundary
}
