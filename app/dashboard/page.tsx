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
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
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

  // Doughnut chart data
  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Others'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
    }],
  };

  // Bar chart data for daily sales
  const dailySalesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }],
  };

  const quickStats = [
    { 
      label: "Revenue Growth",
      value: "+12.5%",
      trend: "up",
      description: "vs last month"
    },
    {
      label: "Customer Retention",
      value: "94.2%",
      trend: "up",
      description: "retention rate"
    },
    {
      label: "Cart Abandonment",
      value: "21.8%",
      trend: "down",
      description: "decreased by 3%"
    },
    {
      label: "Avg Order Value",
      value: "$142.35",
      trend: "up",
      description: "+5.8% increase"
    }
  ];

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

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">{stat.label}</div>
              <div className={`rounded-full p-2 ${stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {stat.trend === 'up' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={categoryData} options={{ responsive: true }} />
          </CardContent>
        </Card>

        {/* Daily Sales Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={dailySalesData} options={{ responsive: true }} />
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.slice(0, 3).map((product, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>{product.name}</span>
                </div>
                <span className="font-medium">{product.revenue}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span>{item.name}</span>
                <span className="text-red-500 font-medium">{item.stock} left</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.slice(0, 3).map((notification, index) => (
              <div key={index} className="py-2">
                <p className="text-sm">{notification.text}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
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