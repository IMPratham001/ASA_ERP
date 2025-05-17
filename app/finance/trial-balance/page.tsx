
"use client";

import { TrialBalance } from "@/components/finance/trial-balance";

export default function TrialBalancePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Trial Balance</h1>
      <TrialBalance />
    </div>
  );
}
