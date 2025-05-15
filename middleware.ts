
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasPermission } from './lib/auth/permissions';

const publicPaths = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user');
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Parse user data
  const userData = JSON.parse(user.value);

  // Check permissions based on path
  if (path.startsWith('/settings') && !hasPermission(userData, 'settings', 'view')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
