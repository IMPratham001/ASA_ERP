import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import axios from "@/lib/api/axios";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Call Laravel login endpoint
    const response = await axios.post('/auth/login', {
      email,
      password
    });

    if (!response.data.access_token) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const userData = response.data.user;
    const token = sign(userData, JWT_SECRET, { expiresIn: "7d" });

    const nextResponse = NextResponse.json(
      { success: true, user: userData },
      { status: 200 }
    );

    // Set secure cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    });

    return nextResponse;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }
}