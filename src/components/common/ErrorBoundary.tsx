import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, ShieldAlert, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  viewName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Hospital EMR Error Caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleSoftReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[420px] w-full flex items-center justify-center p-6 bg-white border border-rose-200 rounded-xl shadow-3d-lg">
          <div className="max-w-lg w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 shadow-inner-bevel flex items-center justify-center text-rose-600 mx-auto animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Module Rendering Exception Recovered
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                A localized runtime issue occurred while loading{' '}
                <strong className="text-slate-800">{this.props.viewName || 'this module'}</strong>.
                Patient records and HIPAA sessions remain secure.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-left font-mono text-[11px] overflow-x-auto shadow-inner">
                <div className="text-rose-400 font-bold mb-1">Exception Details:</div>
                <div className="break-all">{this.state.error.toString()}</div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleSoftReset}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Loading Module</span>
              </button>

              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-3d-sm btn-3d flex items-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Refresh Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
