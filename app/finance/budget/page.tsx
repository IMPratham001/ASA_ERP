
"use client";

import { BudgetManagement } from "@/components/finance/budget-management";

export default function BudgetPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Budget Management</h1>
      <BudgetManagement />
    </div>
  );
}
