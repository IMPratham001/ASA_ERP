import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccessModule } from './lib/auth/permissions'; // Permission checker
import { User } from './types'; // Assuming User type is shared

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Allow API routes, static files, and Next internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  const moduleName = extractModuleFromPath(pathname); // Custom function

  // Redirect to login if not authenticated and trying to access protected route
  if (!token && !isPublic) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated, verify token
  if (token) {
    try {
      const user = await getUserFromToken(token, request.url); // Custom function below

      if (!user) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('token');
        response.cookies.delete('user');
        return response;
      }

      // If on login/register page while already logged in
      if (isPublic && pathname !== '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Module-level access control
      if (!isPublic && !canAccessModule(user, moduleName)) {
        return NextResponse.redirect(new URL('/403', request.url)); // Or a custom "Access Denied" page
      }

    } catch (err) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('token');
      response.cookies.delete('user');
      return response;
    }
  }

  return NextResponse.next();
}

// ---------------------------
// Helpers
// ---------------------------

// Extract module name from route
function extractModuleFromPath(path: string): string {
  const segments = path.split('/');
  return segments[1] || 'dashboard'; // default fallback module
}

// Verifies token and fetches user info
async function getUserFromToken(token: string, baseUrl: string): Promise<User | null> {
  try {
    const url = new URL(baseUrl);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || `${url.protocol}//${url.host}`;

    const res = await fetch(`${apiBaseUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.user as User;
  } catch (err) {
    console.error('Token verification error:', err);
    return null;
  }
}

// ---------------------------
// Middleware matcher
// ---------------------------
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
