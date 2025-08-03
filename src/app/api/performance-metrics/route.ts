import { NextResponse } from 'next/server';

/**
 * Performance Metrics API Route for Next.js App Router
 * Static export compatible - provides performance monitoring info
 */

// Configure for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  return NextResponse.json({
    message: 'Performance Metrics API is running',
    timestamp: new Date().toISOString(),
    mode: 'static-export',
    note: 'Performance metrics are handled by Netlify Functions in production',
    supportedMetrics: ['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP'],
  });
}
