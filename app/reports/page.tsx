
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  FileSpreadsheet, 
  FileText,
  Filter,
  Calendar,
  RefreshCw 
} from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [reportType, setReportType] = useState("sales");
  const [reportView, setReportView] = useState("chart");
  const [filterStore, setFilterStore] = useState("all");
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summaryStats, setSummaryStats] = useState({
    totalSales: 0,
    averageOrder: 0,
    totalOrders: 0,
    topProducts: []
  });

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with actual data structure
      const response = await generateReportData(reportType, dateRange, filterStore);
      setReportData(response);
      setSummaryStats({
        totalSales: 125000,
        averageOrder: 250,
        totalOrders: 500,
        topProducts: [
          { name: "Product A", sales: 150 },
          { name: "Product B", sales: 120 },
          { name: "Product C", sales: 90 }
        ]
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange, filterStore]);

  const generateReportData = (type, range, store) => {
    const baseData = {
      sales: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "Sales",
          data: [12000, 19000, 15000, 17000, 22000, 25000],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
        }]
      },
      inventory: {
        labels: ["In Stock", "Low Stock", "Out of Stock"],
        datasets: [{
          label: "Inventory Status",
          data: [65, 20, 15],
          backgroundColor: [
            "rgba(75, 192, 192, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(255, 99, 132, 0.5)",
          ],
        }]
      },
      staff: {
        labels: ["Sales", "Support", "Management", "IT"],
        datasets: [{
          label: "Staff Distribution",
          data: [30, 15, 10, 5],
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
          ],
        }]
      },
      financial: {
        labels: ["Revenue", "Expenses", "Profit", "Tax"],
        datasets: [{
          label: "Financial Overview",
          data: [50000, 30000, 20000, 5000],
          backgroundColor: [
            "rgba(75, 192, 192, 0.5)",
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
          ],
        }]
      }
    };
    return baseData[type];
  };

  const exportReport = async (format) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: reportType,
          format,
          dateRange,
          store: filterStore,
          data: reportData
        }),
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportType}-${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTableView = () => {
    if (!reportData?.datasets?.[0]?.data) return null;
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Label</th>
              <th className="border p-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {reportData.labels.map((label, index) => (
              <tr key={index}>
                <td className="border p-2">{label}</td>
                <td className="border p-2">{reportData.datasets[0].data[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSummaryView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-bold">Total Sales</div>
            <div className="text-3xl font-bold text-green-600">
              ${summaryStats.totalSales.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-bold">Average Order</div>
            <div className="text-3xl font-bold text-blue-600">
              ${summaryStats.averageOrder.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-bold">Total Orders</div>
            <div className="text-3xl font-bold text-purple-600">
              {summaryStats.totalOrders.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-bold">Top Products</div>
            <div className="mt-2">
              {summaryStats.topProducts.map((product, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{product.name}</span>
                  <span>{product.sales} units</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
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
            onClick={() => exportReport('pdf')}
            disabled={isLoading}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DatePickerWithRange value={dateRange} onChange={setDateRange} />
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Report</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
                <SelectItem value="staff">Staff Report</SelectItem>
                <SelectItem value="financial">Financial Report</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStore} onValueChange={setFilterStore}>
              <SelectTrigger>
                <SelectValue placeholder="Select Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                <SelectItem value="main">Main Store</SelectItem>
                <SelectItem value="branch1">Branch 1</SelectItem>
                <SelectItem value="branch2">Branch 2</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={fetchReportData}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={reportView} onValueChange={setReportView}>
        <TabsList>
          <TabsTrigger value="chart">Charts</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          {reportData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reportType === 'sales' ? (
                    <Line data={reportData} />
                  ) : reportType === 'inventory' ? (
                    <Pie data={reportData} />
                  ) : (
                    <Bar data={reportData} />
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Data</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTableView()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          {renderSummaryView()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
