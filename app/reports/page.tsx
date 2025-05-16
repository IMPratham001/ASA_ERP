
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Download, Filter } from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [filters, setFilters] = useState({
    store: "all",
    type: "all",
  });

  const generateReport = (type) => {
    // Implementation will connect to backend API
    console.log("Generating report:", type, filters, dateRange);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Store</label>
              <Select value={filters.store} onValueChange={(value) => setFilters({ ...filters, store: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  <SelectItem value="main">Main Store</SelectItem>
                  <SelectItem value="branch1">Branch 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View detailed sales analytics and trends
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => generateReport("sales")}>Generate</Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track stock levels and movement
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => generateReport("inventory")}>Generate</Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View profit and loss statements
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => generateReport("financial")}>Generate</Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
