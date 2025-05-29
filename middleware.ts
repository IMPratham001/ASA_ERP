import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/'];

// Define protected routes that require authentication
const PROTECTED_PATHS = ['/dashboard', '/finance', '/settings', '/inventory', '/sales'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Allow API routes to pass through (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  // If no token and trying to access protected route, redirect to login
  if (!token && (isProtectedPath || (!isPublicPath && pathname !== '/'))) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If has token, verify it's valid
  if (token) {
    try {
      const isValidToken = await verifyToken(token, request.url);
      
      if (!isValidToken) {
        // Token is invalid, clear it and redirect to login
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('token');
        response.cookies.delete('user');
        return response;
      }

      // If has valid token and trying to access login page, redirect to dashboard
      if (isPublicPath && pathname !== '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Token verification failed, redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('token');
      response.cookies.delete('user');
      return response;
    }
  }

  return NextResponse.next();
}

// Token verification function
async function verifyToken(token: string, baseUrl: string): Promise<boolean> {
  try {
    // Extract base URL for API calls
    const url = new URL(baseUrl);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || `${url.protocol}//${url.host}`;
    
    const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};