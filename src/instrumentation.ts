// This file configures the initialization of Sentry for the entire application.
// This is required for Next.js 15+ and replaces separate server/edge config files.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry initialization
    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
      tracesSampleRate: 1,

      // Enable logs to be sent to Sentry
      enableLogs: true,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

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
      tracesSampleRate: 1,

      // Enable logs to be sent to Sentry
      enableLogs: true,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
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
  // Capture the error with Sentry, including request context
  Sentry.captureRequestError(err, request, context);
}
