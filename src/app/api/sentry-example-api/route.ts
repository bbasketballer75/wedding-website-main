import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

/**
 * Sentry Example API Route for Next.js App Router
 * Demonstrates error reporting and performance monitoring
 */

// Configure for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    // Example of successful operation with Sentry transaction
    return await Sentry.withServerActionInstrumentation('sentry-example-api', async () => {
      // Simulate some work
      await new Promise((resolve) => setTimeout(resolve, 100));

      return NextResponse.json({
        message: 'Sentry example API is working',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      });
    });
  } catch (error) {
    console.error('Sentry example API error:', error);
    Sentry.captureException(error);

    return NextResponse.json({ error: 'Sentry example API failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Intentional error for testing Sentry error reporting
    if (body.triggerError) {
      throw new Error('Intentional error for Sentry testing');
    }

    // Test custom event
    if (body.testEvent) {
      Sentry.addBreadcrumb({
        message: 'Custom test event',
        level: 'info',
        data: body.testEvent,
      });

      Sentry.captureMessage('Test event from sentry-example-api', 'info');
    }

    return NextResponse.json({
      success: true,
      message: 'Sentry example processed',
      received: body,
    });
  } catch (error) {
    console.error('Sentry example API error:', error);
    Sentry.captureException(error);

    return NextResponse.json({ error: 'Sentry example API failed' }, { status: 500 });
  }
}
