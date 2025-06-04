'use client';

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Title,
  Tooltip,
  Legend,
  BarElement,
  RadialLinearScale
);

import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { StoreSwitcher } from "@/components/shared/store-switcher";
import api from "@/lib/api/axios";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalRevenue: 0,
      customers: 0,
      orders: 0,
      inventory: 0,
      revenueChange: 0,
      customersChange: 0,
      ordersChange: 0,
      inventoryChange: 0,
    },
    recentSales: [],
    salesPerformance: {
      labels: [],
      revenue: [],
      profit: [],
    },
    categoryDistribution: {
      labels: [],
      data: [],
    },
    hourlyTraffic: {
      labels: [],
      data: [],
    },
    performanceMetrics: {
      sales: 0,
      traffic: 0,
      conversion: 0,
      growth: 0,
      retention: 0,
    },
    topProducts: [],
    systemStatus: 'operational',
    inventoryAlerts: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ 
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date() 
  });

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      // Fetch all dashboard data from your backend API
      const [
        overviewRes,
        salesRes,
        categoriesRes,
        trafficRes,
        metricsRes,
        productsRes,
        recentSalesRes,
        statusRes,
        alertsRes
      ] = await Promise.all([
        api.get('/dashboard/overview', { 
          params: { 
            from: dateRange.from.toISOString(), 
            to: dateRange.to.toISOString() 
          } 
        }),
        api.get('/dashboard/sales-performance', { 
          params: { 
            from: dateRange.from.toISOString(), 
            to: dateRange.to.toISOString() 
          } 
        }),
        api.get('/dashboard/category-distribution'),
        api.get('/dashboard/hourly-traffic'),
        api.get('/dashboard/performance-metrics'),
        api.get('/dashboard/top-products', { params: { limit: 10 } }),
        api.get('/dashboard/recent-sales', { params: { limit: 5 } }),
        api.get('/dashboard/system-status'),
        api.get('/dashboard/inventory-alerts')
      ]);

      setDashboardData({
        overview: overviewRes.data,
        salesPerformance: salesRes.data,
        categoryDistribution: categoriesRes.data,
        hourlyTraffic: trafficRes.data,
        performanceMetrics: metricsRes.data,
        topProducts: productsRes.data,
        recentSales: recentSalesRes.data,
        systemStatus: statusRes.data.status || 'operational',
        inventoryAlerts: alertsRes.data,
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(`Failed to load dashboard data: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Initial data fetch and setup interval for real-time updates
  useEffect(() => {
    fetchDashboardData();
    
    // Update every 30 seconds for real-time data
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, [dateRange]);

  // Chart configurations
  const salesPerformanceChart = {
    labels: dashboardData.salesPerformance.labels,
    datasets: [
      {
        label: "Revenue",
        data: dashboardData.salesPerformance.revenue,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Profit",
        data: dashboardData.salesPerformance.profit,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryDistributionChart = {
    labels: dashboardData.categoryDistribution.labels,
    datasets: [{
      data: dashboardData.categoryDistribution.data,
      backgroundColor: [
        "rgba(255, 99, 132, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(153, 102, 255, 0.8)",
        "rgba(255, 159, 64, 0.8)",
      ],
      borderWidth: 0,
    }],
  };

  const hourlyTrafficChart = {
    labels: dashboardData.hourlyTraffic.labels,
    datasets: [{
      label: "Visitors",
      data: dashboardData.hourlyTraffic.data,
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    }],
  };

  const performanceMetricsChart = {
    labels: ["Sales", "Traffic", "Conversion", "Growth", "Retention"],
    datasets: [{
      label: "Performance %",
      data: [
        dashboardData.performanceMetrics.sales,
        dashboardData.performanceMetrics.traffic,
        dashboardData.performanceMetrics.conversion,
        dashboardData.performanceMetrics.growth,
        dashboardData.performanceMetrics.retention,
      ],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
    }],
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
  
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
          </div>
          <Button 
            onClick={fetchDashboardData} 
            className="mt-2" 
            size="sm"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      )}
      
      {!isLoading && (
        <>
          <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <StoreSwitcher />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DateRangePicker
                from={dateRange.from}
                to={dateRange.to}
                onFromChange={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                onToChange={(date) => setDateRange(prev => ({ ...prev, to: date }))}
              />
              <Button onClick={fetchDashboardData} variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>Download Report</Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData.overview.totalRevenue)}
                </div>
                <p className={cn(
                  "text-xs",
                  dashboardData.overview.revenueChange >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {formatPercentage(dashboardData.overview.revenueChange)} from last period
                </p>
                <div className="mt-4 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(dashboardData.overview.customers)}
                </div>
                <p className={cn(
                  "text-xs",
                  dashboardData.overview.customersChange >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {formatPercentage(dashboardData.overview.customersChange)} from last period
                </p>
                <div className="mt-4 h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500 rounded" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(dashboardData.overview.orders)}
                </div>
                <p className={cn(
                  "text-xs",
                  dashboardData.overview.ordersChange >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {formatPercentage(dashboardData.overview.ordersChange)} from last period
                </p>
                <div className="mt-4 h-1 w-full bg-gradient-to-r from-orange-500 to-red-500 rounded" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Inventory</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(dashboardData.overview.inventory)}
                </div>
                <p className={cn(
                  "text-xs",
                  dashboardData.overview.inventoryChange >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {formatPercentage(dashboardData.overview.inventoryChange)} from last period
                </p>
                <div className="mt-4 h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500 rounded" />
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.salesPerformance.labels.length > 0 ? (
                  <Line 
                    data={salesPerformanceChart} 
                    options={{ 
                      responsive: true,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return formatCurrency(value);
                            }
                          }
                        }
                      }
                    }} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.categoryDistribution.labels.length > 0 ? (
                  <Doughnut 
                    data={categoryDistributionChart} 
                    options={{ 
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        }
                      }
                    }} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.hourlyTraffic.labels.length > 0 ? (
                  <Bar 
                    data={hourlyTrafficChart} 
                    options={{ 
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                        }
                      }
                    }} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <Radar 
                  data={performanceMetricsChart} 
                  options={{ 
                    responsive: true,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      }
                    }
                  }} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentSales.length > 0 ? (
                    dashboardData.recentSales.map((sale, index) => (
                      <div key={sale.id || index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                            {sale.customerName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{sale.customerName || 'Unknown Customer'}</p>
                            <p className="text-xs text-muted-foreground">{sale.productName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(sale.amount)}</p>
                          <p className="text-xs text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No recent sales</p>
                  )}
                </div>
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
                          "h-3 w-3 rounded-full",
                          dashboardData.systemStatus === 'operational' ? "bg-green-500 animate-pulse" : 
                          dashboardData.systemStatus === 'warning' ? "bg-yellow-500 animate-pulse" : 
                          "bg-red-500 animate-pulse"
                        )}
                      />
                      <span className="text-sm capitalize">{dashboardData.systemStatus}</span>
                    </div>
                  </div>
                  
                  {dashboardData.inventoryAlerts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-orange-600">Inventory Alerts</p>
                      {dashboardData.inventoryAlerts.slice(0, 3).map((alert, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          {alert.productName}: {alert.currentStock} left
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dashboardData.topProducts.length > 0 ? (
                  dashboardData.topProducts.slice(0, 6).map((product, index) => (
                    <div
                      key={product.id || index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                        </div>
                      </div>
                      <span className="font-medium">{formatCurrency(product.revenue)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4 col-span-full">No product data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}