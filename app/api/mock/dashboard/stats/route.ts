
import { NextResponse } from 'next/server';

export async function GET() {
  const mockData = {
    status: "success",
    data: {
      overview: {
        totalRevenue: 45231.89,
        customers: 2350,
        orders: 12234,
        inventory: 573
      },
      recentSales: [
        { id: 1, amount: "$1,999.00", customer: "Sarah Davis" },
        { id: 2, amount: "$39.00", customer: "Jackson Miller" },
        { id: 3, amount: "$299.00", customer: "Isabella Nguyen" }
      ],
      topProducts: [
        { name: "Product A", revenue: "$12,234" },
        { name: "Product B", revenue: "$10,446" },
        { name: "Product C", revenue: "$8,753" }
      ]
    }
  };

  return NextResponse.json(mockData);
}
