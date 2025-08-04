import { NextRequest, NextResponse } from 'next/server';

/**
 * Example API Route for Next.js App Router
 * Temporarily disabled Sentry for build troubleshooting
 */

// Configure for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    // Simulate some work
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json({
      message: 'Example API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Example API error:', error);

    return NextResponse.json({ error: 'Example API failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Intentional error for testing - disabled for build
    if (body.triggerError) {
      throw new Error('Intentional error for testing');
    }

    // Test custom event - disabled for build
    if (body.testEvent) {
      console.log('Test event:', body.testEvent);
    }

    return NextResponse.json({
      success: true,
      message: 'Example API processed',
      received: body,
    });
  } catch (error) {
    console.error('Example API error:', error);

    return NextResponse.json({ error: 'Example API failed' }, { status: 500 });
  }
}
