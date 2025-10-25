import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  retry?: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary, retry }: ErrorFallbackProps) {
  // Extract safe error information only
  const isNetworkError = error.message?.toLowerCase().includes('connection') ||
                        error.message?.toLowerCase().includes('network') ||
                        error.message?.toLowerCase().includes('timeout');

  const isAuthError = error.message?.toLowerCase().includes('authentication') ||
                     error.message?.toLowerCase().includes('unauthorized');

  // Don't expose internal error details
  const getErrorMessage = () => {
    if (isNetworkError) {
      return 'Connection issue. Please check your internet and try again.';
    }
    if (isAuthError) {
      return 'Please log in to continue.';
    }
    return 'Something went wrong. Please try again.';
  };

  // Log error securely in development only
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn('Error Boundary (dev only):', {
        message: error.message,
        cause: error.cause,
        stack: error.stack?.split('\n')[0], // Only first line of stack
      });
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Oops! Something went wrong</h3>
        <p className="text-muted-foreground max-w-md">
          {getErrorMessage()}
        </p>
      </div>
      <div className="flex gap-2">
        {retry && (
          <Button onClick={retry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        <Button onClick={resetErrorBoundary} size="sm">
          Reload Page
        </Button>
      </div>
    </div>
  );
}

// Main Error Boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log in development and sanitize error info
    if (import.meta.env.DEV) {
      console.warn('Error Boundary caught error (dev only):', {
        message: error.message,
        componentStack: errorInfo.componentStack?.split('\n').slice(0, 3), // Limit stack trace
      });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent
          error={this.state.error}
          resetErrorBoundary={this.resetError}
        />;
      }

      return <ErrorFallback
        error={this.state.error}
        resetErrorBoundary={this.resetError}
      />;
    }

    return this.props.children;
  }
}