import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { CodeSparkLogo } from '../brand/CodeSparkLogo';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CodeSpark uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090c] p-6 text-white text-center">
          <div className="glass-panel max-w-md w-full rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            {/* Top Logo */}
            <div className="flex justify-center mb-6">
              <CodeSparkLogo size="sm" animate={false} />
            </div>

            {/* Error Icon */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight text-white mb-2">
              Something went unexpected
            </h1>

            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              CodeSpark encountered an unexpected error. Your state is stored safely in your browser.
            </p>

            {this.state.error && (
              <pre className="mb-6 rounded-xl bg-black/40 p-3 text-[11px] font-mono text-rose-300/80 text-left overflow-x-auto max-h-28 border border-white/5">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
