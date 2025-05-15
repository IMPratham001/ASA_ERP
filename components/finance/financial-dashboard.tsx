
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccountingStore } from "@/lib/store/accounting";

export function FinancialDashboard() {
  const { accounts, getAccountBalance, getTrialBalance } = useAccountingStore();

  const totalAssets = accounts
    .filter(a => a.type === 'asset')
    .reduce((sum, account) => sum + getAccountBalance(account.id), 0);

  const totalLiabilities = accounts
    .filter(a => a.type === 'liability')
    .reduce((sum, account) => sum + getAccountBalance(account.id), 0);

  const totalEquity = accounts
    .filter(a => a.type === 'equity')
    .reduce((sum, account) => sum + getAccountBalance(account.id), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₹{totalAssets.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₹{totalLiabilities.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Equity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₹{totalEquity.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
