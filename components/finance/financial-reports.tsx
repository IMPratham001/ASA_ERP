
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccountingStore } from "@/lib/store/accounting";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function FinancialReports() {
  const { accounts, getAccountBalance } = useAccountingStore();
  const [dateRange, setDateRange] = useState({
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

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [30000, 35000, 32000, 38000, 42000, 45000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Expenses',
        data: [25000, 28000, 26000, 30000, 32000, 35000],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Reports</h2>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Balance Sheet Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span>Total Assets</span>
                    <span className="font-semibold">₹{totals.assets.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span>Total Liabilities</span>
                    <span className="font-semibold">₹{totals.liabilities.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Net Worth</span>
                    <span className="font-bold text-primary">₹{(totals.assets - totals.liabilities).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Income Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span>Total Revenue</span>
                    <span className="font-semibold text-green-600">₹{totals.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span>Total Expenses</span>
                    <span className="font-semibold text-red-600">₹{totals.expenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Net Income</span>
                    <span className="font-bold text-primary">₹{(totals.revenue - totals.expenses).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Financial Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {accounts.map((account) => (
                  <div key={account.id} className="flex justify-between items-center p-3 bg-muted/30 rounded hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.code}</p>
                    </div>
                    <span className="font-semibold">₹{getAccountBalance(account.id).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
