
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreSwitcher } from "@/components/shared/store-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Target } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <StoreSwitcher />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                    <h3 className="text-2xl font-bold mt-2">₹6.35M</h3>
                    <div className="flex items-center mt-1 text-emerald-600">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="text-sm">+22.1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
                    <h3 className="text-2xl font-bold mt-2">28.5%</h3>
                    <div className="flex items-center mt-1 text-red-600">
                      <ArrowDownRight className="h-4 w-4" />
                      <span className="text-sm">-0.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Target</p>
                    <h3 className="text-2xl font-bold mt-2">82%</h3>
                    <div className="flex items-center mt-1 text-emerald-600">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">On Track</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    />
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inflow" fill="#82ca9d" />
                    <Bar dataKey="outflow" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Stock Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#82ca9d" />
                  <Bar dataKey="minimum" fill="#ff7f7f" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="new" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="returning" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const salesData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
];

const expenseData = [
  { name: 'Rent', value: 400 },
  { name: 'Utilities', value: 300 },
  { name: 'Salaries', value: 300 },
  { name: 'Marketing', value: 200 },
];

const cashFlowData = [
  { name: 'Week 1', inflow: 4000, outflow: 2400 },
  { name: 'Week 2', inflow: 3000, outflow: 1398 },
  { name: 'Week 3', inflow: 2000, outflow: 9800 },
  { name: 'Week 4', inflow: 2780, outflow: 3908 },
];

const stockData = [
  { name: 'Product A', current: 100, minimum: 20 },
  { name: 'Product B', current: 80, minimum: 30 },
  { name: 'Product C', current: 40, minimum: 25 },
  { name: 'Product D', current: 60, minimum: 40 },
];

const customerData = [
  { month: 'Jan', new: 400, returning: 240 },
  { month: 'Feb', new: 300, returning: 139 },
  { month: 'Mar', new: 200, returning: 980 },
  { month: 'Apr', new: 278, returning: 390 },
  { month: 'May', new: 189, returning: 480 },
  { month: 'Jun', new: 239, returning: 380 },
];
