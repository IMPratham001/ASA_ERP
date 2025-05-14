
"use client";

import { Button } from "@/components/ui/button";
import { Plus, Filter, Download } from "lucide-react";
import { InvoiceList } from "@/components/features/billing/invoice-list";
import { DateRangePicker } from "@/components/features/reports/date-range-picker";
import { useState } from "react";

export default function InvoicesPage() {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Invoices</h1>
        <div className="flex gap-4">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <InvoiceList />
      </div>
    </div>
  );
}
