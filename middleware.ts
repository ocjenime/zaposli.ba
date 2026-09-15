import { NextResponse, type NextRequest } from 'next/server';

// These are the only routes that require login. Everything else is public.
const PROTECTED_PREFIXES = ['/poslovi/', '/izdvojeni-oglasi/'];

const STATIC_PREFIXES = ['/_next/', '/images/', '/fonts/', '/favicon', '/api/'];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isStatic(pathname: string) {
  return STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function hasAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => {
    const name = cookie.name.toLowerCase();
    return (
      name.includes('auth-token') ||
      name.includes('access-token') ||
      name.includes('refresh-token')
    );
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and all non-protected pages are always allowed.
  if (isStatic(pathname) || !isProtected(pathname)) {
    return NextResponse.next();
  }

  if (hasAuthCookie(request)) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/prijava/', request.url);
  loginUrl.searchParams.set('redirectTo', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
};
