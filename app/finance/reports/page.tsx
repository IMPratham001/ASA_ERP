
"use client";

import { FinancialReports } from "@/components/finance/financial-reports";

export default function FinancialReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Financial Reports</h1>
      <FinancialReports />
    </div>
  );
}
