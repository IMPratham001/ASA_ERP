"use client";

import { useState } from "react";
import {
  BarChart,
  Activity,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Bell,
  Calendar,
  AlertTriangle,
  Layers,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  X,
  Check,
  FileText,
} from "lucide-react";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function DashboardPage() {
  // State for notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New customer registration: John Smith",
      isNew: true,
      time: "10 min ago",
    },
    { id: 2, text: "Order #45692 fulfilled", isNew: true, time: "25 min ago" },
    {
      id: 3,
      text: "Inventory alert: 'iPhone 13 Pro' low stock",
      isNew: false,
      time: "1 hour ago",
    },
    {
      id: 4,
      text: "New feature deployed: Improved analytics",
      isNew: false,
      time: "2 hours ago",
    },
  ]);

  // Sample low stock items
  const lowStockItems = [
    { id: 1, name: "iPhone 13 Pro", stock: 5, threshold: 10 },
    { id: 2, name: "Samsung Galaxy S22", stock: 3, threshold: 10 },
    { id: 3, name: "AirPods Pro", stock: 8, threshold: 15 },
  ];

  // Sample recent orders
  const recentOrders = [
    {
      id: "ORD-7892",
      customer: "Emma Wilson",
      amount: "$1,234.56",
      status: "Completed",
      date: "Today",
    },
    {
      id: "ORD-7891",
      customer: "James Brown",
      amount: "$897.00",
      status: "Processing",
      date: "Today",
    },
    {
      id: "ORD-7890",
      customer: "Olivia Davis",
      amount: "$2,145.30",
      status: "Completed",
      date: "Yesterday",
    },
    {
      id: "ORD-7889",
      customer: "Noah Martinez",
      amount: "$478.25",
      status: "Pending",
      date: "Yesterday",
    },
  ];

  // Sample top selling products
  const topProducts = [
    {
      id: 1,
      name: "iPhone 13 Pro",
      sales: 432,
      revenue: "$567,890",
      trend: "+12%",
    },
    {
      id: 2,
      name: "Samsung Galaxy S22",
      sales: 387,
      revenue: "$425,670",
      trend: "+8%",
    },
    {
      id: 3,
      name: "AirPods Pro",
      sales: 298,
      revenue: "$89,400",
      trend: "+23%",
    },
    {
      id: 4,
      name: 'MacBook Pro 16"',
      sales: 156,
      revenue: "$343,200",
      trend: "+5%",
    },
  ];

  // Quick actions
  const quickActions = [
    { icon: <Users size={18} />, label: "Add Customer" },
    { icon: <FileText size={18} />, label: "Create Invoice" },
    { icon: <Package size={18} />, label: "Add Product" },
    { icon: <ShoppingCart size={18} />, label: "New Order" },
  ];

  // Clear notification
  const clearNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  // Line Chart Data
  const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Revenue",
      },
    },
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            <Calendar className="mr-2 h-4 w-4" />
            May 16, 2025
          </button>
        </div>
      </div>

      {/* Main stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent">
            <div className="text-sm font-medium">Total Revenue</div>
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">$845,231.89</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+20.1%</span> from
                last month
              </p>
              <div className="text-xs font-medium text-muted-foreground">
                YTD: $3.4M
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent">
            <div className="text-sm font-medium">Active Customers</div>
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">24,350</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+18.1%</span> from
                last month
              </p>
              <div className="text-xs font-medium text-muted-foreground">
                New: +320
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20 dark:to-transparent">
            <div className="text-sm font-medium">Active Orders</div>
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
              <ShoppingCart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">12,234</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+19%</span> from
                last month
              </p>
              <div className="text-xs font-medium text-muted-foreground">
                Pending: 145
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent">
            <div className="text-sm font-medium">Inventory Items</div>
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
              <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">9,573</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 font-medium">-2.3%</span> from
                last month
              </p>
              <div className="text-xs font-medium text-red-500">
                Low stock: 8
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Row */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <h3 className="text-md font-medium">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main content area */}
      <div className="grid gap-6 lg:grid-cols-8">
        {/* Left column - Charts */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Sales Overview Card */}
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex flex-col">
                <h3 className="text-lg font-medium">Sales Overview</h3>
                <p className="text-sm text-muted-foreground">
                  Monthly revenue performance
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Weekly
                </button>
                <button className="text-sm font-medium">Monthly</button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Yearly
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex flex-col">
                <h3 className="text-lg font-medium">Monthly Revenue</h3>
                <p className="text-sm text-muted-foreground">
                  Revenue trends over the last 7 months
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Line data={lineChartData} options={lineChartOptions} />
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="shadow-md">
            <CardHeader className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-lg font-medium">Recent Orders</h3>
                <p className="text-sm text-muted-foreground">
                  Latest transaction details
                </p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                View All
              </button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                        ORDER ID
                      </th>
                      <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                        CUSTOMER
                      </th>
                      <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                        AMOUNT
                      </th>
                      <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                        STATUS
                      </th>
                      <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                        DATE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 text-sm">{order.id}</td>
                        <td className="py-3 text-sm font-medium">
                          {order.customer}
                        </td>
                        <td className="py-3 text-sm">{order.amount}</td>
                        <td className="py-3 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : order.status === "Processing"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            }`}
                          >
                            {order.status === "Completed" && (
                              <Check className="mr-1 h-3 w-3" />
                            )}
                            {order.status === "Processing" && (
                              <Activity className="mr-1 h-3 w-3" />
                            )}
                            {order.status === "Pending" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Stats and Activity */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Top Selling Products */}
          <Card className="shadow-md">
            <CardHeader className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-lg font-medium">Top Products</h3>
                <p className="text-sm text-muted-foreground">
                  By revenue this month
                </p>
              </div>
              <div className="rounded-md bg-muted p-1">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-md bg-muted p-2">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sales} units
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{product.revenue}</p>
                      <p className="text-xs text-green-500 flex items-center justify-end">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {product.trend}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Alerts */}
          <Card className="shadow-md">
            <CardHeader className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-lg font-medium">Inventory Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Items with low stock
                </p>
              </div>
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1.5">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Layers className="h-8 w-8 text-muted-foreground" />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                          {item.stock}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Threshold: {item.threshold}
                        </p>
                      </div>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-md">
            <CardHeader className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Activity Feed</h3>
                {notifications.some((n) => n.isNew) && (
                  <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                Mark all as read
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative flex items-start gap-3 rounded-lg border p-3 ${
                      notification.isNew
                        ? "bg-blue-50 dark:bg-blue-950/20"
                        : "bg-background"
                    }`}
                  >
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                      <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{notification.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                    <button
                      onClick={() => clearNotification(notification.id)}
                      className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Mock component for Clock icon since it wasn't imported
function Clock({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}
