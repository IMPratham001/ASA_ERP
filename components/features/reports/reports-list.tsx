
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export function ReportsList() {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });

  const reports = [
    {
      category: "Sales",
      items: [
        { title: "Sales by Customer", href: "/reports/sales/customer" },
        { title: "Sales by Item", href: "/reports/sales/item" },
        { title: "Sales by Sales Person", href: "/reports/sales/person" },
      ]
    },
    {
      category: "Receivables",
      items: [
        { title: "AR Aging Summary", href: "/reports/receivables/aging" },
        { title: "Invoice Details", href: "/reports/receivables/invoices" },
        { title: "Customer Balance", href: "/reports/receivables/balance" },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <Input placeholder="Search reports..." className="max-w-xs" />
        <Button>Run Report</Button>
      </div>

      <div className="grid gap-6">
        {reports.map((group) => (
          <Card key={group.category}>
            <CardHeader>
              <CardTitle>{group.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {group.items.map((item) => (
                  <Button 
                    key={item.title} 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => window.location.href = item.href}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
