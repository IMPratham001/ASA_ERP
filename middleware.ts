
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isLoginPage = request.nextUrl.pathname === '/auth/login';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  const isPublicRoute = isLoginPage || isApiRoute;

  // Allow API routes to pass through
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect to dashboard if logged in and trying to access login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if not logged in and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
  ],
};
