import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Simple validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) { // Note: Use proper password hashing in production
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate token
    const token = sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    // Create response
    const response = NextResponse.json({
      user: { id: user.id, email: user.email },
      token
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}