import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes (allow without authentication)
  const publicRoutes = ['/login'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token in request headers
  // Note: We can't access localStorage in middleware, so we'll handle auth client-side
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
