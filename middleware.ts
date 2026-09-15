import { NextResponse, type NextRequest } from 'next/server';

// Middleware is currently a no-op. All public pages are intentionally open;
// auth gating for client-only actions (e.g. posting a job) is handled inside
// those pages/components so that listings remain public and SEO-friendly.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
};
