"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/features/reports/date-range-picker";

export function ReportsList() {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <Button>Generate Report</Button>
          </div>
          <div className="grid gap-4">
            {/* Report items will be rendered here */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}