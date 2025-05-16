
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Download, 
  FileSpreadsheet, 
  FileText,
  Filter,
  Calendar,
  RefreshCw,
  TrendingUp,
  PieChart,
  BarChart as BarChartIcon,
  Table as TableIcon,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  DollarSign,
  Users,
  Box
} from "lucide-react";
import { Bar, Line, Pie, Radar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [reportType, setReportType] = useState("financial");
  const [reportView, setReportView] = useState("dashboard");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [comparisonPeriod, setComparisonPeriod] = useState("previous_year");
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [metrics, setMetrics] = useState({
    financial: {
      revenue: { current: 15250000, previous: 12800000, trend: "+19.1%" },
      profit: { current: 4350000, previous: 3680000, trend: "+18.2%" },
      expenses: { current: 8900000, previous: 7600000, trend: "+17.1%" },
      margins: { current: "28.5%", previous: "28.8%", trend: "-0.3%" }
    },
    operational: {
      efficiency: { current: "92.3%", previous: "89.1%", trend: "+3.2%" },
      productivity: { current: 856, previous: 798, trend: "+7.3%" },
      utilization: { current: "87.2%", previous: "84.5%", trend: "+2.7%" }
    },
    market: {
      marketShare: { current: "23.5%", previous: "21.2%", trend: "+2.3%" },
      customerSatisfaction: { current: 4.6, previous: 4.4, trend: "+0.2" },
      brandValue: { current: "A+", previous: "A", trend: "↑" }
    }
  });

  const generateAdvancedReportData = () => {
    // Simulated data generation for different report types
    const data = {
      financial: {
        revenue: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          current: [1.2, 1.3, 1.4, 1.3, 1.5, 1.6, 1.4, 1.3, 1.5, 1.6, 1.7, 1.8].map(x => x * 1000000),
          previous: [1.1, 1.2, 1.3, 1.2, 1.4, 1.5, 1.3, 1.2, 1.4, 1.5, 1.6, 1.7].map(x => x * 1000000)
        },
        profitMargins: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          data: [28.5, 29.1, 27.8, 28.9]
        },
        expenses: {
          labels: ["Operations", "Marketing", "R&D", "Admin", "Sales", "IT"],
          data: [35, 20, 15, 10, 12, 8]
        }
      },
      operational: {
        productivity: {
          labels: Array.from({length: 12}, (_, i) => `Week ${i+1}`),
          data: Array.from({length: 12}, () => 75 + Math.random() * 20)
        },
        departmental: {
          labels: ["Sales", "Operations", "IT", "HR", "Finance", "R&D"],
          efficiency: [92, 88, 95, 85, 90, 87],
          utilization: [88, 85, 92, 80, 87, 84]
        }
      },
      market: {
        regions: {
          labels: ["North", "South", "East", "West", "Central"],
          market_share: [25, 22, 20, 18, 15],
          growth: [8, 5, 6, 4, 7]
        },
        competitors: {
          labels: ["Our Company", "Competitor A", "Competitor B", "Competitor C", "Others"],
          data: [23.5, 20.1, 18.4, 15.8, 22.2]
        }
      }
    };
    return data[reportType];
  };

  const fetchAdvancedReportData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with advanced data
      const response = await new Promise(resolve => 
        setTimeout(() => resolve(generateAdvancedReportData()), 1000)
      );
      setReportData(response);
    } catch (error) {
      console.error("Error fetching advanced report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvancedReportData();
  }, [reportType, dateRange, filterRegion, filterDepartment, comparisonPeriod]);

  const renderMetricCard = (title, data, icon) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{data.current}</h3>
            <div className={`flex items-center mt-1 ${
              data.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.trend.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span className="text-sm">{data.trend}</span>
            </div>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            {icon}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">vs Previous: {data.previous}</p>
      </CardContent>
    </Card>
  );

  const renderFinancialDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricCard("Revenue", metrics.financial.revenue, <DollarSign className="h-6 w-6 text-blue-600" />)}
        {renderMetricCard("Profit", metrics.financial.profit, <TrendingUp className="h-6 w-6 text-green-600" />)}
        {renderMetricCard("Expenses", metrics.financial.expenses, <BarChartIcon className="h-6 w-6 text-red-600" />)}
        {renderMetricCard("Profit Margins", metrics.financial.margins, <PieChart className="h-6 w-6 text-purple-600" />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue comparison</CardDescription>
          </CardHeader>
          <CardContent>
            {reportData?.revenue && (
              <Line
                data={{
                  labels: reportData.revenue.labels,
                  datasets: [
                    {
                      label: 'Current Period',
                      data: reportData.revenue.current,
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      fill: true
                    },
                    {
                      label: 'Previous Period',
                      data: reportData.revenue.previous,
                      borderColor: 'rgb(107, 114, 128)',
                      backgroundColor: 'rgba(107, 114, 128, 0.1)',
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: value => `$${(value/1000000).toFixed(1)}M`
                      }
                    }
                  }
                }}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            {reportData?.expenses && (
              <Pie
                data={{
                  labels: reportData.expenses.labels,
                  datasets: [{
                    data: reportData.expenses.data,
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(249, 115, 22, 0.8)',
                      'rgba(139, 92, 246, 0.8)',
                      'rgba(236, 72, 153, 0.8)',
                      'rgba(107, 114, 128, 0.8)'
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'right' }
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderOperationalDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderMetricCard("Efficiency", metrics.operational.efficiency, <TrendingUp className="h-6 w-6 text-green-600" />)}
        {renderMetricCard("Productivity", metrics.operational.productivity, <Users className="h-6 w-6 text-blue-600" />)}
        {renderMetricCard("Resource Utilization", metrics.operational.utilization, <Box className="h-6 w-6 text-purple-600" />)}
      </div>

      {reportData?.departmental && (
        <Card>
          <CardHeader>
            <CardTitle>Departmental Performance</CardTitle>
            <CardDescription>Efficiency vs Utilization</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Radar
              data={{
                labels: reportData.departmental.labels,
                datasets: [
                  {
                    label: 'Efficiency',
                    data: reportData.departmental.efficiency,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgb(59, 130, 246)',
                    pointBackgroundColor: 'rgb(59, 130, 246)'
                  },
                  {
                    label: 'Utilization',
                    data: reportData.departmental.utilization,
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: 'rgb(16, 185, 129)',
                    pointBackgroundColor: 'rgb(16, 185, 129)'
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderMarketDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderMetricCard("Market Share", metrics.market.marketShare, <Globe className="h-6 w-6 text-blue-600" />)}
        {renderMetricCard("Customer Satisfaction", metrics.market.customerSatisfaction, <Users className="h-6 w-6 text-green-600" />)}
        {renderMetricCard("Brand Rating", metrics.market.brandValue, <TrendingUp className="h-6 w-6 text-purple-600" />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportData?.regions && (
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Market share and growth by region</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels: reportData.regions.labels,
                  datasets: [
                    {
                      label: 'Market Share (%)',
                      data: reportData.regions.market_share,
                      backgroundColor: 'rgba(59, 130, 246, 0.8)'
                    },
                    {
                      label: 'Growth (%)',
                      data: reportData.regions.growth,
                      backgroundColor: 'rgba(16, 185, 129, 0.8)'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        )}

        {reportData?.competitors && (
          <Card>
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
              <CardDescription>Market share distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <Pie
                data={{
                  labels: reportData.competitors.labels,
                  datasets: [{
                    data: reportData.competitors.data,
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(249, 115, 22, 0.8)',
                      'rgba(139, 92, 246, 0.8)',
                      'rgba(107, 114, 128, 0.8)'
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'right' }
                  }
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics & Reporting</h1>
          <p className="text-gray-500 mt-1">
            Comprehensive business intelligence and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => exportReport('xlsx')}
            disabled={isLoading}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button 
            variant="outline"
            onClick={() => exportReport('pdf')}
            disabled={isLoading}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <DatePickerWithRange value={dateRange} onChange={setDateRange} />
            </div>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financial Analytics</SelectItem>
                <SelectItem value="operational">Operational Metrics</SelectItem>
                <SelectItem value="market">Market Analysis</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north">North</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="east">East</SelectItem>
                <SelectItem value="west">West</SelectItem>
              </SelectContent>
            </Select>
            <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Comparison Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous_year">Previous Year</SelectItem>
                <SelectItem value="previous_quarter">Previous Quarter</SelectItem>
                <SelectItem value="previous_month">Previous Month</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={fetchAdvancedReportData}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          {renderFinancialDashboard()}
        </TabsContent>

        <TabsContent value="operational">
          {renderOperationalDashboard()}
        </TabsContent>

        <TabsContent value="market">
          {renderMarketDashboard()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
