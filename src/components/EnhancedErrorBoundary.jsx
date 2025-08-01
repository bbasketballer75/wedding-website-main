import * as Sentry from '@sentry/nextjs';
import React from 'react';
import PropTypes from 'prop-types';

// Enhanced error boundary with context
export class EnhancedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Enhanced error reporting with user context
    Sentry.withScope((scope) => {
      scope.setTag('component', this.props.componentName || 'Unknown');
      scope.setLevel('error');
      scope.setContext('errorInfo', errorInfo);
      scope.setContext('userAgent', navigator.userAgent);
      scope.setContext('timestamp', new Date().toISOString());

      // Add wedding-specific context
      scope.setContext('weddingContext', {
        currentPage: window.location.pathname,
        userInteraction: this.props.lastUserAction,
        sessionDuration: Date.now() - this.props.sessionStart,
      });

      Sentry.captureException(error);
    });

    this.setState({ errorInfo });
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
  lastUserAction: PropTypes.string,
  sessionStart: PropTypes.number,
};

EnhancedErrorBoundary.defaultProps = {
  componentName: 'Unknown',
  lastUserAction: null,
  sessionStart: Date.now(),
};
