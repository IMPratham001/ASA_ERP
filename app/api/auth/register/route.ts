
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/email";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'employee', // Default role
      }
    });

    // Generate verification token
    const verificationToken = sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { success: true, message: "Registration successful. Please verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
