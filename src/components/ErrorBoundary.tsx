/**
 * 错误边界组件
 * 捕获 React 组件树中的错误并提供优雅的降级 UI
 */

import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // 如果 resetKeys 变化，重置错误状态
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys![index])
    ) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.reset}
        />
      );
    }

    return this.props.children;
  }
}

// ========================================
// 默认错误降级 UI
// ========================================

interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}

function DefaultErrorFallback({ error, errorInfo, onReset }: DefaultErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1428] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full backdrop-blur-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.1)]"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-white mb-4">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-center text-white/60 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div className="mb-6 p-4 rounded-2xl bg-black/30 border border-white/10 overflow-auto max-h-64">
            <div className="text-red-400 mb-2">
              <strong>Error:</strong> {error.message}
            </div>
            {errorInfo && (
              <pre className="text-xs text-white/40 overflow-x-auto">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 rounded-2xl backdrop-blur-xl bg-white/10 text-white border border-white/20 flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </motion.button>
        </div>

        {/* Help Text */}
        <p className="text-center text-white/40 mt-6 text-sm">
          If this problem persists, please contact support.
        </p>
      </motion.div>
    </div>
  );
}

// ========================================
// 紧凑型错误边界（用于小组件）
// ========================================

export function CompactErrorBoundary({ children, componentName }: { children: ReactNode; componentName?: string }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-medium">Error loading {componentName || 'component'}</div>
              <div className="text-sm text-red-400/60">Please try refreshing the page</div>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// ========================================
// 网络错误边界
// ========================================

export function NetworkErrorBoundary({ children, onRetry }: { children: ReactNode; onRetry?: () => void }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 rounded-3xl backdrop-blur-2xl bg-orange-500/10 border border-orange-500/20 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-white mb-2">Network Error</h3>
          <p className="text-white/60 mb-4">Failed to load data. Please check your connection.</p>
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Retry
            </motion.button>
          )}
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
