
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const taxSettings = await prisma.taxSetting.findMany();
    return NextResponse.json(taxSettings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tax settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const taxSetting = await prisma.taxSetting.create({ data });
    return NextResponse.json(taxSetting);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tax setting" }, { status: 500 });
  }
}
