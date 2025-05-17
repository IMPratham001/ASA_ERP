"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreSwitcher } from "@/components/shared/store-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar, BarChart, Line, LineChart, Pie, PieChart, 
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, Area, AreaChart
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Target, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ReportsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success' },
    { id: 2, type: 'warning' },
    { id: 3, type: 'error' }
  ]);

  // Enhanced sample data
  const salesData = [
    { name: 'Jan', revenue: 4000, profit: 2400, expenses: 1600 },
    { name: 'Feb', revenue: 3000, profit: 1398, expenses: 1602 },
    { name: 'Mar', revenue: 2000, profit: 9800, expenses: 2200 },
    { name: 'Apr', revenue: 2780, profit: 3908, expenses: 1872 },
    { name: 'May', revenue: 1890, profit: 4800, expenses: 2090 },
    { name: 'Jun', revenue: 2390, profit: 3800, expenses: 1590 },
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
  
  const { invoices, products } = useStore();
  
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`h-3 w-3 rounded-full ${
                  notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                } animate-pulse`}
              />
            ))}
          </div>
          <StoreSwitcher />
        </div>
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
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={salesData}>
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Growth</p>
                    <h3 className="text-2xl font-bold mt-2">28.5%</h3>
                    <div className="flex items-center mt-1 text-red-600">
                      <ArrowDownRight className="h-4 w-4" />
                      <span className="text-sm">-0.3%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={salesData}>
                      <Area type="monotone" dataKey="profit" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Performance</p>
                    <h3 className="text-2xl font-bold mt-2">92%</h3>
                    <div className="flex items-center mt-1 text-emerald-600">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">On Track</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={salesData}>
                      <Area type="monotone" dataKey="expenses" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="expenses" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Monthly Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" />
                    <Bar dataKey="profit" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
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