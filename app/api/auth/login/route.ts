
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Demo authentication logic
    let isValid = false;
    let userData = null;

    if (email === "admin@example.com" && password === "admin") {
      isValid = true;
      userData = {
        id: "1",
        email,
        name: "Super Admin",
        role: "admin"
      };
    } else if (email === "manager@example.com" && password === "manager") {
      isValid = true;
      userData = {
        id: "2",
        email,
        name: "Store Manager",
        role: "manager"
      };
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = sign(userData, JWT_SECRET, { expiresIn: "7d" });

    // Create response
    const response = NextResponse.json(
      { success: true, user: userData },
      { status: 200 }
    );

    // Set cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
