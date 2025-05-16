
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Filter, FileSpreadsheet, FileText } from "lucide-react";
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

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Sales",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
    }]
  };

  const staffData = {
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
  };

  const inventoryData = {
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
  };

  const exportReport = (format) => {
    console.log(`Exporting ${reportType} report in ${format} format`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport("excel")}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => exportReport("pdf")}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <DatePickerWithRange value={dateRange} onChange={setDateRange} />
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Report</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
                <SelectItem value="staff">Staff Report</SelectItem>
                <SelectItem value="finance">Financial Report</SelectItem>
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

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={salesData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={staffData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={inventoryData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={salesData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
