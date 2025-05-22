
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const permissions = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      }
    });
    return NextResponse.json(permissions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update permissions" }, { status: 500 });
  }
}
