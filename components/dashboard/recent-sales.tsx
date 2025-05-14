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
          {/* Mock data - replace with real data */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <Avatar className="h-9 w-9" />
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">Customer {i}</p>
                <p className="text-sm text-muted-foreground">order_{Math.random().toString(36).slice(2)}</p>
              </div>
              <div className="ml-auto font-medium">+${(Math.random() * 1000).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}