"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      {["John Doe", "Alice Smith", "Bob Wilson"].map((name, i) => (
        <div key={i} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-sm text-muted-foreground">
              {`order_${Math.random().toString(36).substr(2, 9)}`}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +₹{(Math.random() * 1000).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}