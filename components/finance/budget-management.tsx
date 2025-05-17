
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAccountingStore } from "@/lib/store/accounting";

export function BudgetManagement() {
  const [budgets, setBudgets] = useState({
    revenue: 0,
    expenses: 0,
    marketing: 0,
    operations: 0
  });

  const handleBudgetChange = (category: string, value: string) => {
    setBudgets(prev => ({
      ...prev,
      [category]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Budget Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={budgets.revenue}
              onChange={(e) => handleBudgetChange('revenue', e.target.value)}
              placeholder="Enter target revenue"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={budgets.expenses}
              onChange={(e) => handleBudgetChange('expenses', e.target.value)}
              placeholder="Enter expenses limit"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marketing Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={budgets.marketing}
              onChange={(e) => handleBudgetChange('marketing', e.target.value)}
              placeholder="Enter marketing budget"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operations Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={budgets.operations}
              onChange={(e) => handleBudgetChange('operations', e.target.value)}
              placeholder="Enter operations budget"
            />
          </CardContent>
        </Card>
      </div>
      <Button className="w-full">Save Budget Allocations</Button>
    </div>
  );
}
