
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const PUBLIC_PATHS = ['/auth/login', '/api/auth/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token');

  // Allow API routes to pass through
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // If has token and trying to access login page, redirect to dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
