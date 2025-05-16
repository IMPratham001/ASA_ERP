
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
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

  useEffect(() => {
    // Simulated data fetch based on filters
    const fetchReportData = () => {
      // This would be replaced with actual API calls
      const data = generateReportData(reportType, dateRange, filterStore);
      setReportData(data);
    };
    fetchReportData();
  }, [reportType, dateRange, filterStore]);

  const generateReportData = (type, range, store) => {
    // Simulated data generation
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
    try {
      // This would be replaced with actual export logic
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
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport('xlsx')}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => exportReport('pdf')}>
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
          </div>
        </CardContent>
      </Card>

      <Tabs value={reportView} onValueChange={setReportView}>
        <TabsList>
          <TabsTrigger value="chart">Charts</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
      </Tabs>

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
    </div>
  );
}
