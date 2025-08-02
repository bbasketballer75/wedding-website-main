'use client';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Lazy import Sentry to avoid build issues
let Sentry = null;
try {
  // Only import Sentry in browser environment
  if (typeof window !== 'undefined') {
    Sentry = require('@sentry/nextjs');
  }
} catch (error) {
  console.warn('Sentry not available:', error);
}

// Enhanced error boundary with context
export class EnhancedErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Enhanced error reporting with user context
    if (Sentry && Sentry.withScope) {
      Sentry.withScope((scope) => {
        scope.setTag('component', this.props.componentName || 'Unknown');
        scope.setLevel('error');
        scope.setContext('errorInfo', {
          componentStack: errorInfo.componentStack,
          sessionStart: this.props.sessionStart,
          timestamp: new Date().toISOString(),
        });
        scope.setContext('props', {
          componentName: this.props.componentName,
          fallbackMessage: this.props.fallbackMessage,
        });
        Sentry.captureException(error);
      });
    } else {
      // Fallback logging when Sentry is not available
      console.error('Error in component:', this.props.componentName || 'Unknown', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-card">
            <h2>🌸 Oops! Something went wrong</h2>
            <p>We're sorry, but there was an issue loading this part of our wedding website.</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
            <p className="error-help-text">
              If this problem persists, please let Austin & Jordyn know!
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

EnhancedErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  componentName: PropTypes.string,
  fallbackMessage: PropTypes.string,
  sessionStart: PropTypes.number,
};

EnhancedErrorBoundary.defaultProps = {
  componentName: 'Unknown',
  fallbackMessage: 'Something went wrong',
  sessionStart: Date.now(),
};
