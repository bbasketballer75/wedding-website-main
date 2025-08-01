// This file configures the initialization of Sentry for the entire application.
// This is required for Next.js 15+ and replaces separate server/edge config files.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

export function register() {
  // Only initialize Sentry if DSN is available
  if (!process.env.SENTRY_DSN) {
    console.log('Sentry DSN not found - skipping Sentry initialization for development');
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry initialization
    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,

      // Enable logs to be sent to Sentry
      enableLogs: process.env.NODE_ENV === 'production',

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',

      // Enable automatic instrumentation of Node.js modules
      integrations: [
        // Add performance monitoring
        Sentry.httpIntegration(),
        Sentry.expressIntegration(),
        Sentry.nodeContextIntegration(),
      ],
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry initialization
    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,

      // Enable logs to be sent to Sentry
      enableLogs: process.env.NODE_ENV === 'production',

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',
    });
  }
}

// Hook to capture errors from nested React Server Components
export async function onRequestError(
  err: unknown,
  request: {
    path: string;
    method: string;
    headers: Record<string, string | string[] | undefined>;
  },
  context: {
    routerKind: 'Pages Router' | 'App Router';
    routePath: string;
    routeType: 'render' | 'route' | 'middleware' | 'action';
  }
) {
  // Only capture error with Sentry if DSN is available
  if (process.env.SENTRY_DSN) {
    Sentry.captureRequestError(err, request, context);
  } else {
    // Fallback to console logging in development
    console.error('Request Error:', {
      error: err,
      path: request.path,
      method: request.method,
      routePath: context.routePath,
      routeType: context.routeType,
    });
  }
}
