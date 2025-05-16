"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-slate-600">Welcome back to your ERP dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Revenue</p>
              <h3 className="text-2xl font-bold">$24,500</h3>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Products</p>
              <h3 className="text-2xl font-bold">1,240</h3>
              <p className="text-sm text-slate-600">120 low stock</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-violet-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Customers</p>
              <h3 className="text-2xl font-bold">840</h3>
              <p className="text-sm text-green-600">+8% new customers</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Order #{i}234</p>
                  <p className="text-xs text-slate-500">2 items • Processing</p>
                </div>
                <p className="text-sm font-medium">$120.00</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Daily Sales</p>
                  <p className="text-xs text-slate-500">150 units sold</p>
                </div>
                <p className="text-sm font-medium text-green-600">+12%</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}