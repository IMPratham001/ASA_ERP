
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

export async function POST(request: Request) {
  try {
    const { userId, role } = await verifyAuth(request);
    const data = await request.json();
    
    const template = await prisma.template.create({
      data: {
        ...data,
        userId,
        version: 1
      }
    });
    
    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await verifyAuth(request);
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}
