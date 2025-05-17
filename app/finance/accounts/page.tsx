
"use client";

import { ChartOfAccounts } from "@/components/finance/chart-of-accounts";

export default function AccountsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Chart of Accounts</h1>
      <ChartOfAccounts />
    </div>
  );
}
