import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { vendorTheme as themeColors } from '../../../../theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: themeColors.backgroundGradient }}>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: '#FEE2E2',
              }}
            >
              <FiAlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-left mb-4">
                <summary className="text-xs text-gray-500 cursor-pointer mb-2">Error details</summary>
                <pre className="text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all active:scale-95"
                style={{
                  background: themeColors.button,
                  boxShadow: `0 4px 12px ${themeColors.button}40`,
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 transition-all active:scale-95"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

