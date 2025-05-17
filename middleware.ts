import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// Define public routes that don't require authentication
const PUBLIC_PATHS = ['/auth/login', '/api/auth/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token');

  // Always allow API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // If on a public path and has token, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If on a protected path and no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};