import { NextResponse } from 'next/server';

/**
 * Analytics API Route for Next.js App Router
 * Static export compatible - provides analytics endpoint info
 */

// Configure for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  return NextResponse.json({
    message: 'Analytics API is running',
    timestamp: new Date().toISOString(),
    mode: 'static-export',
    note: 'Analytics events are handled by Vercel Functions in production',
  });
}
