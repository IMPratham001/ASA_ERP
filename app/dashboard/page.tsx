'use client';

import React, { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Basic utility function
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Simple Card components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-lg rounded-lg border border-gray-200 ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, variant = "default", size = "default", className = "", disabled = false }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
  const variantClasses = variant === "outline" 
    ? "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400" 
    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg";
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

// Enhanced icons
const DollarSign = () => <span className="text-xl">💰</span>;
const Users = () => <span className="text-xl">👥</span>;
const ShoppingCart = () => <span className="text-xl">🛒</span>;
const Package = () => <span className="text-xl">📦</span>;
const Activity = () => <span className="text-xl">📊</span>;
const Clock = () => <span className="text-xl">🕐</span>;
const AlertTriangle = () => <span className="text-xl">⚠️</span>;
const TrendingUp = () => <span className="text-xl">📈</span>;
const TrendingDown = () => <span className="text-xl">📉</span>;
const BarChart3 = () => <span className="text-xl">📊</span>;
const PieChart = () => <span className="text-xl">🥧</span>;
const Settings = () => <span className="text-xl">⚙️</span>;
const RefreshCw = () => <span className="text-xl">🔄</span>;
const Download = () => <span className="text-xl">⬇️</span>;
const Filter = () => <span className="text-xl">🔍</span>;

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
      data: [],
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
      averageOrderValue: 0,
      customerLifetimeValue: 0,
    },
    topProducts: [],
    systemStatus: 'operational',
    inventoryAlerts: [],
    revenueByMonth: [],
    customerGrowth: [],
    ordersByStatus: [],
    geographicData: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState([]);
  const [dateRange, setDateRange] = useState({ 
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date() 
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  // Debug function
  const addDebugInfo = (info) => {
    setDebugInfo(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  // Enhanced API call function
  const makeAPICall = async (endpoint, params = {}) => {
    try {
      addDebugInfo(`Calling ${endpoint}`);
      
      const queryParams = new URLSearchParams({
        ...params,
        timestamp: Date.now().toString(),
      });
      
      const response = await fetch(`/api${endpoint}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      addDebugInfo(`✅ ${endpoint} success`);
      return data;
    } catch (error) {
      addDebugInfo(`❌ ${endpoint} failed: ${error.message}`);
      throw error;
    }
  };

  // Enhanced data fetching
  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      addDebugInfo("Starting comprehensive data fetch...");
      
      const endpoints = [
        { key: 'overview', url: '/dashboard/overview', params: { 
          from: dateRange.from.toISOString(), 
          to: dateRange.to.toISOString(),
          timeframe: selectedTimeframe
        }},
        { key: 'salesPerformance', url: '/dashboard/sales-performance', params: { 
          from: dateRange.from.toISOString(), 
          to: dateRange.to.toISOString(),
          timeframe: selectedTimeframe
        }},
        { key: 'categoryDistribution', url: '/dashboard/category-distribution', params: {
          timeframe: selectedTimeframe
        }},
        { key: 'hourlyTraffic', url: '/dashboard/hourly-traffic', params: {
          date: new Date().toISOString().split('T')[0]
        }},
        { key: 'performanceMetrics', url: '/dashboard/performance-metrics', params: {
          timeframe: selectedTimeframe
        }},
        { key: 'topProducts', url: '/dashboard/top-products', params: { 
          limit: 10,
          timeframe: selectedTimeframe
        }},
        { key: 'recentSales', url: '/dashboard/recent-sales', params: { 
          limit: 10 
        }},
        { key: 'systemStatus', url: '/dashboard/system-status' },
        { key: 'inventoryAlerts', url: '/dashboard/inventory-alerts' },
        { key: 'revenueByMonth', url: '/dashboard/revenue-by-month', params: {
          months: 12
        }},
        { key: 'customerGrowth', url: '/dashboard/customer-growth', params: {
          timeframe: selectedTimeframe
        }},
        { key: 'ordersByStatus', url: '/dashboard/orders-by-status' },
        { key: 'geographicData', url: '/dashboard/geographic-data' },
      ];

      const results = await Promise.allSettled(
        endpoints.map(endpoint => makeAPICall(endpoint.url, endpoint.params))
      );
      
      const newData = { ...dashboardData };
      let successCount = 0;
      
      endpoints.forEach((endpoint, index) => {
        const result = results[index];
        if (result.status === 'fulfilled') {
          successCount++;
          if (endpoint.key === 'systemStatus') {
            newData.systemStatus = result.value?.status || 'operational';
          } else if (endpoint.key === 'salesPerformance' && result.value) {
            // Transform sales performance data for charts
            newData.salesPerformance = {
              ...result.value,
              data: result.value.labels?.map((label, idx) => ({
                date: label,
                revenue: result.value.revenue?.[idx] || 0,
                profit: result.value.profit?.[idx] || 0,
              })) || []
            };
          } else {
            newData[endpoint.key] = result.value || newData[endpoint.key];
          }
        }
      });

      addDebugInfo(`✅ ${successCount}/${endpoints.length} endpoints successful`);
      setDashboardData(newData);
      setLastUpdated(new Date());
      setIsLoading(false);
      
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(`Failed to load dashboard data: ${err.message}`);
      addDebugInfo(`❌ Fatal error: ${err.message}`);
      setIsLoading(false);
    }
  }, [dateRange, selectedTimeframe]);

  // Auto-refresh setup
  useEffect(() => {
    fetchDashboardData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchDashboardData, refreshInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchDashboardData, autoRefresh, refreshInterval]);

  // Utility functions
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number) => {
    if (typeof number !== 'number' || isNaN(number)) return '0';
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    }
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return new Intl.NumberFormat('en-US').format(number);
  };

  const formatPercentage = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return '0.0%';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setDebugInfo([]);
    fetchDashboardData();
  };

  const testAPIConnection = async () => {
    try {
      addDebugInfo("Testing API connection...");
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        addDebugInfo(`✅ API connection successful - ${data.status || 'OK'}`);
      } else {
        addDebugInfo(`❌ API connection failed: ${response.status}`);
      }
    } catch (error) {
      addDebugInfo(`❌ API connection error: ${error.message}`);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const timeframes = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              <Clock />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Timeframe Selector */}
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              {timeframes.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
            
            {/* Auto-refresh toggle */}
            <Button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
            >
              <RefreshCw />
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
            
            <Button onClick={testAPIConnection} variant="outline" size="sm">
              <Settings /> Test API
            </Button>
            
            <Button onClick={exportData} variant="outline" size="sm">
              <Download /> Export
            </Button>
            
            <Button onClick={handleRefresh} variant="default" size="sm" disabled={isLoading}>
              <Activity /> Refresh
            </Button>
          </div>
        </div>

        {/* Debug Panel */}
        {debugInfo.length > 0 && (
          <Card className="bg-gray-900 text-green-400">
            <CardHeader>
              <CardTitle className="text-green-400">System Debug Console</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black p-4 rounded-lg text-sm font-mono max-h-40 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <div key={index} className="mb-1 opacity-90">{info}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600">Loading dashboard data...</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertTriangle />
                  <div>
                    <p className="font-medium">Error Loading Dashboard</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  <RefreshCw /> Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Dashboard Content */}
        {!isLoading && (
          <>
            {/* Enhanced Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">Total Revenue</CardTitle>
                  <DollarSign />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(dashboardData.overview.totalRevenue)}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {dashboardData.overview.revenueChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                    <span className="text-sm text-blue-100">
                      {formatPercentage(dashboardData.overview.revenueChange)} from last period
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-100">Active Users</CardTitle>
                  <Users />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatNumber(dashboardData.overview.customers)}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {dashboardData.overview.customersChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                    <span className="text-sm text-green-100">
                      {formatPercentage(dashboardData.overview.customersChange)} from last period
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-orange-100">Orders</CardTitle>
                  <ShoppingCart />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatNumber(dashboardData.overview.orders)}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {dashboardData.overview.ordersChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                    <span className="text-sm text-orange-100">
                      {formatPercentage(dashboardData.overview.ordersChange)} from last period
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-purple-100">Inventory</CardTitle>
                  <Package />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatNumber(dashboardData.overview.inventory)}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {dashboardData.overview.inventoryChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                    <span className="text-sm text-purple-100">
                      {formatPercentage(dashboardData.overview.inventoryChange)} from last period
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatPercentage(dashboardData.performanceMetrics.conversion)}
                  </div>
                  <p className="text-sm text-indigo-700 font-medium">Conversion Rate</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {formatCurrency(dashboardData.performanceMetrics.averageOrderValue)}
                  </div>
                  <p className="text-sm text-pink-700 font-medium">Avg Order Value</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-teal-50 to-teal-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {formatNumber(dashboardData.performanceMetrics.traffic)}
                  </div>
                  <p className="text-sm text-teal-700 font-medium">Traffic</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatPercentage(dashboardData.performanceMetrics.growth)}
                  </div>
                  <p className="text-sm text-yellow-700 font-medium">Growth Rate</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-red-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatPercentage(dashboardData.performanceMetrics.retention)}
                  </div>
                  <p className="text-sm text-red-700 font-medium">Retention</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-600">
                    {formatCurrency(dashboardData.performanceMetrics.customerLifetimeValue)}
                  </div>
                  <p className="text-sm text-cyan-700 font-medium">Customer LTV</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Sales Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 />
                    Sales Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardData.salesPerformance.data || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280"
                          fontSize={12}
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          formatter={(value, name) => [formatCurrency(value), name]}
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stackId="1"
                          stroke="#3B82F6"
                          fill="url(#colorRevenue)"
                          name="Revenue"
                        />
                        <Area
                          type="monotone"
                          dataKey="profit"
                          stackId="1"
                          stroke="#10B981"
                          fill="url(#colorProfit)"
                          name="Profit"
                        />
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart />
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData.categoryDistribution.data || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(dashboardData.categoryDistribution.data || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* More Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Hourly Traffic */}
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Traffic (Today)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.hourlyTraffic.data || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="traffic" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Month */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend (12 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.revenueByMonth || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                        />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#F59E0B" 
                          strokeWidth={3}
                          dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

              {/* Bottom Section */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Sales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart />
                    Recent Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(dashboardData.recentSales || []).slice(0, 5).map((sale, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {sale.customer?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{sale.customer || 'Unknown Customer'}</p>
                            <p className="text-xs text-gray-500">{sale.product || 'Product'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {formatCurrency(sale.amount || 0)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {sale.date ? new Date(sale.date).toLocaleDateString() : 'Today'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!dashboardData.recentSales || dashboardData.recentSales.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingCart />
                        <p className="mt-2">No recent sales data</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package />
                    Top Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(dashboardData.topProducts || []).slice(0, 5).map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-sm">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{product.name || `Product ${index + 1}`}</p>
                            <p className="text-xs text-gray-500">
                              {formatNumber(product.sales || 0)} sales
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-purple-600">
                            {formatCurrency(product.revenue || 0)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPercentage(product.growth || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!dashboardData.topProducts || dashboardData.topProducts.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <Package />
                        <p className="mt-2">No product data</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* System Status & Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* System Status */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          dashboardData.systemStatus === 'operational' ? 'bg-green-500' : 
                          dashboardData.systemStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">System Status</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dashboardData.systemStatus === 'operational' ? 'bg-green-100 text-green-800' :
                        dashboardData.systemStatus === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {dashboardData.systemStatus?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>

                    {/* Inventory Alerts */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle />
                        Inventory Alerts
                      </h4>
                      <div className="space-y-2">
                        {(dashboardData.inventoryAlerts || []).slice(0, 3).map((alert, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded border-l-4 border-red-400">
                            <div>
                              <p className="text-sm font-medium text-red-800">
                                {alert.product || `Product ${index + 1}`}
                              </p>
                              <p className="text-xs text-red-600">
                                {alert.message || 'Low stock alert'}
                              </p>
                            </div>
                            <span className="text-xs text-red-600 font-medium">
                              {alert.stock || 0} left
                            </span>
                          </div>
                        ))}
                        {(!dashboardData.inventoryAlerts || dashboardData.inventoryAlerts.length === 0) && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No alerts</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Growth */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Users />
                        Customer Growth
                      </h4>
                      <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={dashboardData.customerGrowth || []}>
                            <Line 
                              type="monotone" 
                              dataKey="customers" 
                              stroke="#10B981" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders by Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 />
                  Orders by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.ordersByStatus || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Geographic Data */}
            {dashboardData.geographicData && dashboardData.geographicData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity />
                    Geographic Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.geographicData.slice(0, 5).map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-medium">
                              {region.country?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <span className="font-medium">{region.country || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${((region.value || 0) / Math.max(...(dashboardData.geographicData || []).map(r => r.value || 0))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {formatNumber(region.value || 0)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}