
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/permissions';

const PUBLIC_PATHS = ['/auth/login', '/api/auth/login'];
const API_PATHS = ['/api/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token');

  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    response.headers.set('Access-Control-Allow-Headers', 'Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date');
    
    if (request.method === 'OPTIONS') {
      return response;
    }
  }

  // Security checks
  if (!token && !PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token) {
    try {
      const verified = await verifyToken(token.value);
      if (!verified && !PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
