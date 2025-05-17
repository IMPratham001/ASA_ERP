
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const PUBLIC_PATHS = ['/auth/login', '/api/auth/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect API routes
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      verify(token.value, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  // Handle protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    verify(token.value, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)',],
};
