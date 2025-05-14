
"use client";

import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center">
              <Avatar
                className="h-9 w-9"
              />
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.customer}</p>
                <p className="text-sm text-muted-foreground">{sale.email}</p>
              </div>
              <div className="ml-auto font-medium">+${sale.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const recentSales = [
  {
    id: 1,
    customer: "John Smith",
    email: "john@example.com",
    amount: "350.00"
  },
  {
    id: 2,
    customer: "Sarah Davis",
    email: "sarah@example.com", 
    amount: "299.99"
  },
  {
    id: 3,
    customer: "Mike Johnson",
    email: "mike@example.com",
    amount: "149.99"
  }
];
