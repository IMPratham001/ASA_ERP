"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store/store";
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
            {/* Charts and metrics */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={expenseData} dataKey="value" nameKey="name" />
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#8884d8" />
                    <Bar dataKey="minimum" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}