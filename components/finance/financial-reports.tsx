
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccountingStore } from "@/lib/store/accounting";
import { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Loader2 } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function FinancialReports() {
  const { accounts, getAccountBalance } = useAccountingStore();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date()
  });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const revenueExpenseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [30000, 35000, 32000, 38000, 42000, 45000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      },
      {
        label: 'Expenses',
        data: [25000, 28000, 26000, 30000, 32000, 35000],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  const balanceSheetData = {
    labels: ['Assets', 'Liabilities', 'Equity'],
    datasets: [{
      data: [totals.assets, totals.liabilities, totals.assets - totals.liabilities],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)'
      ],
      borderColor: [
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)'
      ],
      borderWidth: 1
    }]
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
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Reports</h2>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line data={revenueExpenseData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Balance Sheet Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Pie data={balanceSheetData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income Statement Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Bar
                  data={{
                    labels: ['Revenue', 'Expenses', 'Net Income'],
                    datasets: [{
                      label: 'Amount',
                      data: [totals.revenue, totals.expenses, totals.revenue - totals.expenses],
                      backgroundColor: [
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)'
                      ],
                      borderColor: [
                        'rgb(75, 192, 192)',
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)'
                      ],
                      borderWidth: 1
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <CardTitle>Balance Sheet Details</CardTitle>
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
