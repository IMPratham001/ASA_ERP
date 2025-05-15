import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth/tokens';
import { authenticator } from 'otplib';

export async function POST(req: Request) {
  try {
    const { email, password, code } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.status !== 'active') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.twoFactorEnabled) {
      if (!code) {
        return NextResponse.json({ requires2FA: true }, { status: 200 });
      }

      const isValidCode = authenticator.verify({
        token: code,
        secret: user.twoFactorSecret!
      });

      if (!isValidCode) {
        return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 401 });
      }
    }

    const { token, refreshToken, expiresAt } = await generateToken(user.id);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        expiresAt,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      }
    });

    // Log login
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        success: true
      }
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles
      }
    });

    // Set the token in cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 // 7 days
      path: "/"
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}