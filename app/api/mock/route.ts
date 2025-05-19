
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: "success",
    data: {
      users: 100,
      orders: 50,
      revenue: 25000
    }
  });
}
