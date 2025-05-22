
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reports = await prisma.financialReport.findMany({
      include: {
        budgets: true,
        taxSettings: true
      }
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const report = await prisma.financialReport.create({ 
      data,
      include: {
        budgets: true,
        taxSettings: true
      }
    });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
