
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.pdfTemplate.findMany({
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
    const template = await prisma.pdfTemplate.create({
      data: {
        name: data.name,
        content: data.content,
        type: data.type,
        version: 1,
        isActive: true
      }
    });
    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const template = await prisma.pdfTemplate.update({
      where: { id: data.id },
      data: {
        content: data.content,
        version: { increment: 1 }
      }
    });
    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}
