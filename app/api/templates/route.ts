import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const template = await prisma.template.create({ data });
    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}