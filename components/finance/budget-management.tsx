
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

export function BudgetManagement() {
  const [budgets, setBudgets] = useState({
    revenue: 100000,
    expenses: 80000,
    marketing: 20000,
    operations: 30000
  });

  const [actual, setActual] = useState({
    revenue: 85000,
    expenses: 70000,
    marketing: 18000,
    operations: 25000
  });

  const handleBudgetChange = (category: string, value: string) => {
    setBudgets(prev => ({
      ...prev,
      [category]: parseFloat(value) || 0
    }));
  };

  const calculateProgress = (actual: number, budget: number) => {
    return (actual / budget) * 100;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Actual: ₹{actual.revenue.toLocaleString()}</span>
                    <span>Target: ₹{budgets.revenue.toLocaleString()}</span>
                  </div>
                  <Progress value={calculateProgress(actual.revenue, budgets.revenue)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Expenses Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Actual: ₹{actual.expenses.toLocaleString()}</span>
                    <span>Budget: ₹{budgets.expenses.toLocaleString()}</span>
                  </div>
                  <Progress value={calculateProgress(actual.expenses, budgets.expenses)} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Revenue Target</label>
                  <Input
                    type="number"
                    value={budgets.revenue}
                    onChange={(e) => handleBudgetChange('revenue', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Expenses Limit</label>
                  <Input
                    type="number"
                    value={budgets.expenses}
                    onChange={(e) => handleBudgetChange('expenses', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Marketing Budget</label>
                  <Input
                    type="number"
                    value={budgets.marketing}
                    onChange={(e) => handleBudgetChange('marketing', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Operations Budget</label>
                  <Input
                    type="number"
                    value={budgets.operations}
                    onChange={(e) => handleBudgetChange('operations', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <Button className="w-full">Save Budget Allocations</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(budgets).map(([category, budget]) => {
                  const actualValue = actual[category as keyof typeof actual];
                  const variance = actualValue - budget;
                  const percentage = (variance / budget) * 100;

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-medium">{category}</span>
                        <span className={`text-sm ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {percentage.toFixed(1)}% {variance >= 0 ? 'above' : 'below'} budget
                        </span>
                      </div>
                      <Progress value={calculateProgress(actualValue, budget)} />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Actual: ₹{actualValue.toLocaleString()}</span>
                        <span>Budget: ₹{budget.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
