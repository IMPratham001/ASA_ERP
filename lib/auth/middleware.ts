import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './permissions';

export async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const verified = await verifyToken(token.value);
    if (!verified) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/finance/:path*', '/settings/:path*']
};