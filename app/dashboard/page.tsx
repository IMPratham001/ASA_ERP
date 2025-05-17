"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StoreSwitcher } from "@/components/shared/store-switcher";
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
  Check,
  Store,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  Clock,
  Percent,
  ChevronRight,
  Download,
  RefreshCcw,
  PieChart,
  LineChart,
} from "lucide-react";
import { Overview } from "@/components/dashboard/overview";
import { IntegrationTest } from "@/components/shared/integration-test";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Line, Doughnut, Bar, Radar, Pie, PolarArea } from "react-chartjs-2";
import api from "@/lib/api/laravel";

// Register chart components
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
  PolarAreaController,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  RadialLinearScale,
  PolarAreaController,
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
    metrics: {
      conversionRate: 3.2,
      averageOrderValue: 127.45,
      cartAbandonment: 68.7,
      customerLifetimeValue: 843.21,
      returnRate: 4.5,
      netPromotorScore: 78,
    },
    productCategories: {
      electronics: 35,
      clothing: 25,
      homeGoods: 20,
      beauty: 12,
      other: 8,
    },
    customerSegments: {
      new: 28,
      returning: 42,
      loyal: 30,
    },
    salesChannels: {
      direct: 45,
      social: 25,
      search: 15,
      affiliate: 10,
      email: 5,
    },
    trafficSources: {
      organic: 42,
      direct: 28,
      referral: 15,
      social: 10,
      email: 5,
    },
  });
  const [timeframe, setTimeframe] = useState("weekly");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(
          `/dashboard/stats?timeframe=${timeframe}`,
        );
        if (response.data?.status === "success") {
          setDashboardData(response.data.data);
          setLastRefreshed(new Date());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "New Order",
      message: "Order #12345 has been received",
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "warning",
      title: "Low Stock",
      message: "Product SKU-789 is running low",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "error",
      title: "Payment Failed",
      message: "Transaction #8721 failed to process",
      time: "1 hour ago",
    },
  ]);

  // Performance metrics data
  const performanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "rgba(52, 152, 219, 0.5)",
        borderColor: "rgba(52, 152, 219, 1)",
      },
      {
        label: "Revenue",
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: "rgba(46, 204, 113, 0.5)",
        borderColor: "rgba(46, 204, 113, 1)",
      },
    ],
  };

  // Store performance data
  const storePerformance = {
    labels: [
      "Sales",
      "Customer Satisfaction",
      "Inventory",
      "Employee Performance",
      "Revenue Growth",
      "Order Fulfillment",
      "Customer Retention",
    ],
    datasets: [
      {
        label: "Current Period",
        data: [85, 75, 90, 80, 70, 88, 92],
        backgroundColor: "rgba(45, 52, 54, 0.2)",
        borderColor: "rgba(45, 52, 54, 1)",
        fill: true,
      },
      {
        label: "Previous Period",
        data: [80, 70, 85, 75, 65, 82, 88],
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        borderColor: "rgba(52, 152, 219, 1)",
        fill: true,
      },
    ],
  };

  // Category distribution
  const categoryDistribution = {
    labels: Object.keys(dashboardData.productCategories),
    datasets: [
      {
        data: Object.values(dashboardData.productCategories),
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Traffic sources
  const trafficSourcesData = {
    labels: Object.keys(dashboardData.trafficSources),
    datasets: [
      {
        data: Object.values(dashboardData.trafficSources),
        backgroundColor: [
          "rgba(46, 204, 113, 0.7)",
          "rgba(52, 152, 219, 0.7)",
          "rgba(155, 89, 182, 0.7)",
          "rgba(241, 196, 15, 0.7)",
          "rgba(230, 126, 34, 0.7)",
        ],
      },
    ],
  };

  // Sales growth trend
  const salesGrowthData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sales Growth %",
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        data: [3.2, 2.8, 5.7, 4.2, 3.1, 8.5, 7.2, 6.8, 7.5, 9.1, 8.3, 10.2],
      },
    ],
  };

  // Customer segments
  const customerSegmentsData = {
    labels: Object.keys(dashboardData.customerSegments),
    datasets: [
      {
        data: Object.values(dashboardData.customerSegments),
        backgroundColor: [
          "rgba(155, 89, 182, 0.7)",
          "rgba(52, 152, 219, 0.7)",
          "rgba(46, 204, 113, 0.7)",
        ],
        borderColor: [
          "rgba(155, 89, 182, 1)",
          "rgba(52, 152, 219, 1)",
          "rgba(46, 204, 113, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/dashboard/stats?timeframe=${timeframe}`);
      if (response.data?.status === "success") {
        setDashboardData(response.data.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <StoreSwitcher />
        </div>
        <div className="flex items-center space-x-2">
          <Tabs
            defaultValue="weekly"
            className="w-fit"
            onValueChange={setTimeframe}
          >
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="w-full text-center py-2 text-sm text-muted-foreground">
          Loading dashboard data...
        </div>
      )}

      {!isLoading && (
        <div className="text-xs text-muted-foreground text-right">
          Last updated: {lastRefreshed.toLocaleTimeString()}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center text-green-500">
                <ArrowUp className="h-3 w-3" />
                <span className="text-xs font-medium">20.1%</span>
              </div>
              <p className="text-xs text-muted-foreground">from last month</p>
            </div>
            <div className="mt-4 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
          </CardContent>
          <CardFooter className="px-4 py-2">
            <div className="w-full flex justify-between text-xs text-muted-foreground">
              <span>YTD Revenue: $178,453.25</span>
              <span>Target: $1.2M</span>
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center text-green-500">
                <ArrowUp className="h-3 w-3" />
                <span className="text-xs font-medium">180.1%</span>
              </div>
              <p className="text-xs text-muted-foreground">from last month</p>
            </div>
            <div className="mt-4 h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500 rounded" />
          </CardContent>
          <CardFooter className="px-4 py-2">
            <div className="w-full flex justify-between text-xs text-muted-foreground">
              <span>New Users: 876</span>
              <span>Retention: 68.7%</span>
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center text-green-500">
                <ArrowUp className="h-3 w-3" />
                <span className="text-xs font-medium">19%</span>
              </div>
              <p className="text-xs text-muted-foreground">from last month</p>
            </div>
            <div className="mt-4 h-1 w-full bg-gradient-to-r from-orange-500 to-red-500 rounded" />
          </CardContent>
          <CardFooter className="px-4 py-2">
            <div className="w-full flex justify-between text-xs text-muted-foreground">
              <span>
                Avg. Order: ${dashboardData.metrics.averageOrderValue}
              </span>
              <span>Conversion: {dashboardData.metrics.conversionRate}%</span>
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center text-blue-500">
                <Clock className="h-3 w-3" />
                <span className="text-xs font-medium">+201</span>
              </div>
              <p className="text-xs text-muted-foreground">since last hour</p>
            </div>
            <div className="mt-4 h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500 rounded" />
          </CardContent>
          <CardFooter className="px-4 py-2">
            <div className="w-full flex justify-between text-xs text-muted-foreground">
              <span>Top Region: North America</span>
              <span>Growth: 23.5%</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center">
              <div className="text-xl font-bold">
                {dashboardData.metrics.conversionRate}%
              </div>
              <div className="ml-2 flex items-center text-green-500 text-xs">
                <ArrowUp className="h-3 w-3" />
                <span>0.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center">
              <div className="text-xl font-bold">
                ${dashboardData.metrics.averageOrderValue}
              </div>
              <div className="ml-2 flex items-center text-green-500 text-xs">
                <ArrowUp className="h-3 w-3" />
                <span>3.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Cart Abandonment
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center">
              <div className="text-xl font-bold">
                {dashboardData.metrics.cartAbandonment}%
              </div>
              <div className="ml-2 flex items-center text-red-500 text-xs">
                <ArrowUp className="h-3 w-3" />
                <span>2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Customer LTV
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center">
              <div className="text-xl font-bold">
                ${dashboardData.metrics.customerLifetimeValue}
              </div>
              <div className="ml-2 flex items-center text-green-500 text-xs">
                <ArrowUp className="h-3 w-3" />
                <span>5.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Return Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center">
              <div className="text-xl font-bold">
                {dashboardData.metrics.returnRate}%
              </div>
              <div className="ml-2 flex items-center text-green-500 text-xs">
                <ArrowDown className="h-3 w-3" />
                <span>0.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              NPS Score
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center">
              <div className="text-xl font-bold">
                {dashboardData.metrics.netPromotorScore}
              </div>
              <div className="ml-2 flex items-center text-green-500 text-xs">
                <ArrowUp className="h-3 w-3" />
                <span>2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={performanceData} options={{ responsive: true }} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Store Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Radar data={storePerformance} options={{ responsive: true }} />
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Visualizations */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie
                data={categoryDistribution}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </CardContent>
          <CardFooter className="px-4 py-3 border-t">
            <div className="w-full flex justify-between text-sm">
              <span className="text-muted-foreground">Top Category:</span>
              <span className="font-medium">Electronics (35%)</span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <PolarArea
                data={trafficSourcesData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </CardContent>
          <CardFooter className="px-4 py-3 border-t">
            <div className="w-full flex justify-between text-sm">
              <span className="text-muted-foreground">Top Source:</span>
              <span className="font-medium">Organic (42%)</span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut
                data={customerSegmentsData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </CardContent>
          <CardFooter className="px-4 py-3 border-t">
            <div className="w-full flex justify-between text-sm">
              <span className="text-muted-foreground">Largest Segment:</span>
              <span className="font-medium">Returning (42%)</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={salesGrowthData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return value + "%";
                      },
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Channels Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={{
                labels: Object.keys(dashboardData.salesChannels),
                datasets: [
                  {
                    label: "Sales %",
                    data: Object.values(dashboardData.salesChannels),
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.7)",
                      "rgba(54, 162, 235, 0.7)",
                      "rgba(255, 206, 86, 0.7)",
                      "rgba(75, 192, 192, 0.7)",
                      "rgba(153, 102, 255, 0.7)",
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return value + "%";
                      },
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-12">
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex items-center justify-between">
                <span>System Status</span>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full animate-pulse",
                      error ? "bg-red-500" : "bg-green-500",
                    )}
                  />
                  <span>{error ? "System Error" : "Operational"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="py-2 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border-l-4 pl-3 py-1 text-sm"
                  style={{
                    borderColor:
                      notification.type === "success"
                        ? "rgb(34, 197, 94)"
                        : notification.type === "warning"
                          ? "rgb(234, 179, 8)"
                          : "rgb(239, 68, 68)",
                  }}
                >
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {notification.message}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="py-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center gap-1"
              >
                <Bell className="h-4 w-4" />
                <span>View All Notifications</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topProducts.slice(0, 3).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white",
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : "bg-amber-700",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        SKU: {product.sku || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{product.revenue}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.units || 0} units
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3">
            <Button variant="ghost" size="sm" className="w-full">
              View All Products
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-1 justify-center"
              >
                <Package className="h-5 w-5" />
                <span>Add Product</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-1 justify-center"
              >
                <Users className="h-5 w-5" />
                <span>Add Customer</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-1 justify-center"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>New Order</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-1 justify-center"
              >
                <LineChart className="h-5 w-5" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-3 py-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium">Marketing Meeting</div>
                  <div className="text-xs text-muted-foreground">
                    Today, 3:00 PM
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-l-4 border-purple-500 pl-3 py-1">
                <Users className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="font-medium">Team Review</div>
                  <div className="text-xs text-muted-foreground">
                    Tomorrow, 10:00 AM
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-3 py-1">
                <Layers className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="font-medium">Product Launch</div>
                  <div className="text-xs text-muted-foreground">
                    May 20, 9:00 AM
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3">
            <Button variant="ghost" size="sm" className="w-full">
              View Calendar
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex items-center justify-between mt-8">
        <h3 className="text-xl font-bold">AI-Powered Insights</h3>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          Refresh Insights
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <PieChart className="h-4 w-4 mr-2 text-indigo-500" />
              Predicted Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm pb-2">
              Based on current patterns, we predict a{" "}
              <span className="font-bold text-green-500">23% increase</span> in
              sales over the next 30 days.
            </div>
            <div className="h-32">
              <Line
                data={{
                  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                  datasets: [
                    {
                      label: "Current",
                      data: [21, 28, 32, 35],
                      borderColor: "rgba(99, 102, 241, 1)",
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      tension: 0.4,
                      fill: true,
                    },
                    {
                      label: "Predicted",
                      data: [35, 39, 42, 45],
                      borderColor: "rgba(139, 92, 246, 1)",
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                      borderDash: [5, 5],
                      tension: 0.4,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            </div>
            <div className="mt-2 pt-2 border-t border-indigo-500/10 flex justify-between text-xs text-muted-foreground">
              <span>Confidence rate: 87%</span>
              <span className="font-medium text-indigo-500 flex items-center">
                View details <ChevronRight className="h-3 w-3 ml-1" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <Users className="h-4 w-4 mr-2 text-emerald-500" />
              Customer Behavior Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm pb-3">
              Your returning customers spend{" "}
              <span className="font-bold text-emerald-500">2.8x more</span> than
              new customers. Focus on retention.
            </div>
            <div className="flex items-center justify-center h-32">
              <div className="w-32 h-32 relative">
                <Doughnut
                  data={{
                    labels: ["Returning", "New"],
                    datasets: [
                      {
                        data: [74, 26],
                        backgroundColor: [
                          "rgba(16, 185, 129, 0.7)",
                          "rgba(20, 184, 166, 0.3)",
                        ],
                        borderColor: [
                          "rgba(16, 185, 129, 1)",
                          "rgba(20, 184, 166, 0.5)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: { legend: { display: false } },
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold">74%</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-emerald-500/10 flex justify-between text-xs text-muted-foreground">
              <span>Based on last 90 days</span>
              <span className="font-medium text-emerald-500 flex items-center">
                View details <ChevronRight className="h-3 w-3 ml-1" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              Smart Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm pb-3">
              <span className="font-bold text-amber-500">3 products</span> are
              predicted to sell out within 7 days. Restock recommended.
            </div>
            <div className="space-y-2 h-32 overflow-auto pr-1">
              {[
                {
                  name: "Wireless Earbuds Pro",
                  sku: "SKU-789",
                  days: 3,
                  stock: 12,
                  demand: "High",
                },
                {
                  name: 'Ultra HD Monitor 27"',
                  sku: "SKU-456",
                  days: 5,
                  stock: 8,
                  demand: "Medium",
                },
                {
                  name: "Ergonomic Keyboard",
                  sku: "SKU-234",
                  days: 7,
                  stock: 15,
                  demand: "High",
                },
              ].map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-amber-500/5 p-2 rounded-md"
                >
                  <div>
                    <div className="font-medium text-xs">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.sku} • {product.stock} in stock
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                      {product.days}d left
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-amber-500/10 flex justify-between text-xs text-muted-foreground">
              <span>Demand prediction accuracy: 91%</span>
              <span className="font-medium text-amber-500 flex items-center">
                Take action <ChevronRight className="h-3 w-3 ml-1" />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>Smart Recommendations</CardTitle>
              <Tabs defaultValue="business" className="w-fit">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="marketing">Marketing</TabsTrigger>
                  <TabsTrigger value="operations">Operations</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="business" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "Optimize Pricing Strategy",
                    description:
                      "Your top-selling products could generate 18% more revenue with dynamic pricing adjustments.",
                    impact: "High",
                    effort: "Medium",
                    icon: <DollarSign className="h-8 w-8 text-blue-500" />,
                  },
                  {
                    title: "Cross-selling Opportunity",
                    description:
                      "Customers who purchase keyboards rarely buy compatible wrist rests. Bundle these items.",
                    impact: "Medium",
                    effort: "Low",
                    icon: <ShoppingCart className="h-8 w-8 text-purple-500" />,
                  },
                  {
                    title: "New Market Exploration",
                    description:
                      "Based on search trends, consider expanding into Smart Home product category.",
                    impact: "High",
                    effort: "High",
                    icon: <TrendingUp className="h-8 w-8 text-green-500" />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-gray-100 rounded-md dark:bg-gray-800">
                        {item.icon}
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs">
                          Impact: {item.impact}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs">
                          Effort: {item.effort}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-medium mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground flex-grow">
                      {item.description}
                    </p>
                    <div className="mt-4 pt-2 border-t flex items-center justify-end">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Dismiss
                      </Button>
                      <Button size="sm" className="ml-2 text-xs">
                        Apply Insight
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="marketing" className="m-0">
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Marketing recommendations will appear here
              </div>
            </TabsContent>
            <TabsContent value="operations" className="m-0">
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Operations recommendations will appear here
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
