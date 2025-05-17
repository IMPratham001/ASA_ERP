"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreSwitcher } from "@/components/shared/store-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ShoppingCart, ArrowUpRight, ArrowDownRight, Target, PieChart as PieChartIcon } from "lucide-react";

const data = {
  sales: [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ],
  categories: [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Food', value: 300 },
    { name: 'Books', value: 200 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <StoreSwitcher />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Online Revenue</p>
                    <h3 className="text-2xl font-bold mt-2">₹6.35M</h3>
                    <div className="flex items-center mt-1 text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="text-sm">+22.1%</span>
                    </div>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Profit Margins</p>
                    <h3 className="text-2xl font-bold mt-2">28.5%</h3>
                    <div className="flex items-center mt-1 text-red-600">
                      <ArrowDownRight className="h-4 w-4" />
                      <span className="text-sm">-0.3%</span>
                    </div>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <PieChartIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* More cards here... */}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.sales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional tab content... */}
      </Tabs>
    </div>
  );
}