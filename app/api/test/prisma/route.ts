
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test the connection by running a simple query
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'success',
      message: 'Prisma database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Prisma database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
