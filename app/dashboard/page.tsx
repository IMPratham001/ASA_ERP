"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StoreSwitcher } from "@/components/shared/store-switcher";
import {
  BarChart,
  Activity,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Clock,
  Percent,
  Bell,
  Calendar,
  AlertTriangle,
  Layers,
  Plus,
  Search,
  Filter,
  Check,
  Store,
} from "lucide-react";
import { Line, Bar, Radar, Doughnut } from "react-chartjs-2";
import api from "@/lib/api/axios";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";

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
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
);

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalRevenue: 0,
      customers: 0,
      orders: 0,
      inventory: 0,
    },
    recentSales: [],
    monthlyRevenue: {},
    topProducts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/api/mock/dashboard/stats");
        if (response.data?.status === "success") {
          setDashboardData(response.data.data);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const salesPerformance = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Profit",
        data: [8000, 12000, 9000, 17000, 15000, 21000],
        borderColor: "rgb(255, 99, 132)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const categoryDistribution = {
    labels: ["Electronics", "Clothing", "Food", "Books", "Others"],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        "rgba(255, 99, 132, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(153, 102, 255, 0.8)",
      ],
    }],
  };

  const hourlyTraffic = {
    labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
    datasets: [{
      label: "Visitors",
      data: [20, 50, 100, 80, 120, 60],
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    }],
  };

  const performanceMetrics = {
    labels: ["Sales", "Traffic", "Conversion", "Growth", "Retention"],
    datasets: [{
      label: "Current Month",
      data: [85, 75, 90, 80, 70],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    }],
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {!isLoading && !error && (
        <>
          <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <StoreSwitcher />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                <div className="mt-4 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                <div className="mt-4 h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500 rounded" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
                <div className="mt-4 h-1 w-full bg-gradient-to-r from-orange-500 to-red-500 rounded" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 since last hour</p>
                <div className="mt-4 h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500 rounded" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={salesPerformance} options={{ responsive: true }} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Doughnut data={categoryDistribution} options={{ responsive: true }} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={hourlyTraffic} options={{ responsive: true }} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <Radar data={performanceMetrics} options={{ responsive: true }} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>System Status</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className={cn(
                          "h-3 w-3 rounded-full animate-pulse",
                          isLoading ? "bg-yellow-500" : error ? "bg-red-500" : "bg-green-500"
                        )}
                        title={error ? "System Error" : "System Operational"}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.topProducts.slice(0, 3).map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
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
                {dashboardData.overview && (
                  <div className="flex items-center justify-between py-2">
                    <span>Total Inventory</span>
                    <span className="text-red-500 font-medium">
                      {dashboardData.overview.inventory} left
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.recentSales &&
                  dashboardData.recentSales.slice(0, 3).map((sale, index) => (
                    <div key={index} className="py-2">
                      <p className="text-sm">Sale ID: {sale.id}</p>
                      <p className="text-xs text-muted-foreground">
                        Amount: {sale.amount}
                      </p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}