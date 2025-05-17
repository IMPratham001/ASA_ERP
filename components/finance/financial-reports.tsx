
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccountingStore } from "@/lib/store/accounting";
import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export function FinancialReports() {
  const { accounts, getAccountBalance } = useAccountingStore();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: new Date()
  });

  const calculateTotals = () => {
    const assets = accounts
      .filter(a => a.type === 'asset')
      .reduce((sum, account) => sum + getAccountBalance(account.id), 0);

    const liabilities = accounts
      .filter(a => a.type === 'liability')
      .reduce((sum, account) => sum + getAccountBalance(account.id), 0);

    const revenue = accounts
      .filter(a => a.type === 'revenue')
      .reduce((sum, account) => sum + getAccountBalance(account.id), 0);

    const expenses = accounts
      .filter(a => a.type === 'expense')
      .reduce((sum, account) => sum + getAccountBalance(account.id), 0);

    return { assets, liabilities, revenue, expenses };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Reports</h2>
        <DateRangePicker 
          from={dateRange.from} 
          to={dateRange.to}
          onFromChange={(date) => setDateRange(prev => ({ ...prev, from: date }))}
          onToChange={(date) => setDateRange(prev => ({ ...prev, to: date }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Balance Sheet Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Assets</span>
                <span>₹{totals.assets.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Liabilities</span>
                <span>₹{totals.liabilities.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Net Worth</span>
                <span>₹{(totals.assets - totals.liabilities).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Revenue</span>
                <span>₹{totals.revenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Expenses</span>
                <span>₹{totals.expenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Net Income</span>
                <span>₹{(totals.revenue - totals.expenses).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
