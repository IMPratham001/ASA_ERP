"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Users,
  TrendingUp,
  BarChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Building2,
  ShoppingCart,
  UserCheck,
  Target,
  Clock,
  Award,
  Briefcase,
  Star,
} from "lucide-react";
import { Line, Bar, Radar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale as RadarScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { useStore } from "@/lib/store/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [reportType, setReportType] = useState("employees");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { reports, exportReport } = useStore();

  // Simulated employee data
  const employees = [
    { id: 1, name: "John Doe", department: "Sales" },
    { id: 2, name: "Jane Smith", department: "Marketing" },
    { id: 3, name: "Mike Johnson", department: "IT" },
    { id: 4, name: "Sarah Wilson", department: "HR" },
    { id: 5, name: "Tom Brown", department: "Finance" },
  ];

  const employeeMetrics = {
    performance: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        { label: "John Doe", data: [85, 88, 92, 90] },
        { label: "Jane Smith", data: [82, 85, 88, 91] },
        { label: "Mike Johnson", data: [90, 92, 89, 94] },
        { label: "Sarah Wilson", data: [87, 86, 90, 89] },
        { label: "Tom Brown", data: [84, 87, 91, 88] },
      ]
    },
    skills: {
      labels: ["Technical", "Communication", "Leadership", "Teamwork", "Innovation"],
      datasets: [
        { label: "John Doe", data: [4.5, 4.2, 3.8, 4.0, 3.9] },
        { label: "Jane Smith", data: [4.2, 4.5, 4.3, 4.4, 4.1] },
        { label: "Mike Johnson", data: [4.8, 4.0, 3.9, 4.2, 4.5] },
        { label: "Sarah Wilson", data: [4.1, 4.6, 4.4, 4.5, 4.0] },
        { label: "Tom Brown", data: [4.3, 4.1, 4.2, 4.0, 4.3] },
      ]
    },
    productivity: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        { label: "John Doe", data: [92, 88, 90, 92, 94, 91] },
        { label: "Jane Smith", data: [88, 90, 89, 91, 90, 92] },
        { label: "Mike Johnson", data: [94, 93, 95, 92, 94, 96] },
        { label: "Sarah Wilson", data: [90, 89, 91, 90, 92, 91] },
        { label: "Tom Brown", data: [89, 91, 90, 88, 91, 90] },
      ]
    }
  };

  const renderEmployeeComparison = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Selection</CardTitle>
          <CardDescription>Select up to 5 employees to compare</CardDescription>
          <div className="flex flex-wrap gap-2 mt-4">
            {employees.map((emp) => (
              <Button
                key={emp.id}
                variant={selectedEmployees.includes(emp.id) ? "default" : "outline"}
                onClick={() => {
                  if (selectedEmployees.includes(emp.id)) {
                    setSelectedEmployees(selectedEmployees.filter(id => id !== emp.id));
                  } else if (selectedEmployees.length < 5) {
                    setSelectedEmployees([...selectedEmployees, emp.id]);
                  }
                }}
              >
                {emp.name}
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

      {selectedEmployees.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <Line
                  data={{
                    labels: employeeMetrics.performance.labels,
                    datasets: employeeMetrics.performance.datasets
                      .filter(ds => selectedEmployees.includes(employees.find(e => e.name === ds.label)?.id))
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <Radar
                  data={{
                    labels: employeeMetrics.skills.labels,
                    datasets: employeeMetrics.skills.datasets
                      .filter(ds => selectedEmployees.includes(employees.find(e => e.name === ds.label)?.id))
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 5
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productivity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar
                  data={{
                    labels: employeeMetrics.productivity.labels,
                    datasets: employeeMetrics.productivity.datasets
                      .filter(ds => selectedEmployees.includes(employees.find(e => e.name === ds.label)?.id))
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    {selectedEmployees.map(id => (
                      <TableHead key={id}>{employees.find(e => e.id === id)?.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Average Performance</TableCell>
                    {selectedEmployees.map(id => (
                      <TableCell key={id}>
                        {(employeeMetrics.performance.datasets
                          .find(ds => ds.label === employees.find(e => e.id === id)?.name)?.data
                          .reduce((a, b) => a + b, 0) / 4).toFixed(1)}%
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Skills Score</TableCell>
                    {selectedEmployees.map(id => (
                      <TableCell key={id}>
                        {(employeeMetrics.skills.datasets
                          .find(ds => ds.label === employees.find(e => e.id === id)?.name)?.data
                          .reduce((a, b) => a + b, 0) / 5).toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Productivity Index</TableCell>
                    {selectedEmployees.map(id => (
                      <TableCell key={id}>
                        {(employeeMetrics.productivity.datasets
                          .find(ds => ds.label === employees.find(e => e.id === id)?.name)?.data
                          .reduce((a, b) => a + b, 0) / 6).toFixed(1)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
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
          <Button variant="outline" onClick={() => exportReport('excel')} disabled={isLoading}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => exportReport('pdf')} disabled={isLoading}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <DatePickerWithRange value={dateRange} onChange={setDateRange}/>
            <div className="flex gap-2">
              <Select value={undefined} onValueChange={undefined}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setIsLoading(prev => !prev)} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="employees">
            <Users className="w-4 h-4 mr-2" />
            Employee Analysis
          </TabsTrigger>
          <TabsTrigger value="financial">
            <DollarSign className="w-4 h-4 mr-2" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="stores">
            <Building2 className="w-4 h-4 mr-2" />
            Stores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-6">
          {renderEmployeeComparison()}
        </TabsContent>

        <TabsContent value="financial">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Revenue</p>
                      <h3 className="text-2xl font-bold mt-2">
                        {typeof 15250000 === 'number' && 15250000 > 1000
                          ? `₹${(15250000 / 1000000).toFixed(2)}M`
                          : 15250000}
                      </h3>
                      <div className={`flex items-center mt-1 ${'+19.1%'.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {'+19.1%'.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        <span className="text-sm">{'+19.1%'}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Profit</p>
                      <h3 className="text-2xl font-bold mt-2">
                        {typeof 4350000 === 'number' && 4350000 > 1000
                          ? `₹${(4350000 / 1000000).toFixed(2)}M`
                          : 4350000}
                      </h3>
                      <div className={`flex items-center mt-1 ${'+18.2%'.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {'+18.2%'.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        <span className="text-sm">{'+18.2%'}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Expenses</p>
                      <h3 className="text-2xl font-bold mt-2">
                        {typeof 8900000 === 'number' && 8900000 > 1000
                          ? `₹${(8900000 / 1000000).toFixed(2)}M`
                          : 8900000}
                      </h3>
                      <div className={`flex items-center mt-1 ${'+17.1%'.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {'+17.1%'.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        <span className="text-sm">{'+17.1%'}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full">
                      <BarChart className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Profit Margins</p>
                      <h3 className="text-2xl font-bold mt-2">
                        {'28.5%'}
                      </h3>
                      <div className={`flex items-center mt-1 ${'-0.3%'.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {'-0.3%'.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        <span className="text-sm">{'-0.3%'}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full">
                      <PieChart className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  {undefined && (
                    <Line
                      data={{
                        labels: [],
                        datasets: [
                          {
                            label: 'Current Period',
                            data: [],
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true
                          },
                          {
                            label: 'Previous Period',
                            data: [],
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
                              callback: value => `$${(value / 1000000).toFixed(1)}M`
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
                  {undefined && (
                    <Pie
                      data={{
                        labels: [],
                        datasets: [{
                          data: [],
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
        </TabsContent>

        <TabsContent value="stores">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Physical Stores</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Store Revenue</p>
                          <h3 className="text-2xl font-bold mt-2">
                            {typeof 8900000 === 'number' && 8900000 > 1000
                              ? `₹${(8900000 / 1000000).toFixed(2)}M`
                              : 8900000}
                          </h3>
                          <div className={`flex items-center mt-1 ${'+17.1%'.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {'+17.1%'.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="text-sm">{'+17.1%'}</span>
                          </div>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-full">
                          <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Footfall</p>
                          <h3 className="text-2xl font-bold mt-2">
                            {typeof 45600 === 'number' && 45600 > 1000
                              ? `₹${(45600 / 1000000).toFixed(2)}M`
                              : 45600}
                          </h3>
                          <div className={`flex items-center mt-1 ${'+7.8%'.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {'+7.8%'.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="text-sm">{'+7.8%'}</span>
                          </div>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                          <h3 className="text-2xl font-bold mt-2">
                            {'23.5%'}
                          </h3>
                          <div className={`flex items-center mt-1 ${'+2.3%'.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {'+2.3%'.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="text-sm">{'+2.3%'}</span>
                          </div>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Target className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Online Store</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Online Revenue</p>
                          <h3 className="text-2xl font-bold mt-2">
                            {typeof 6350000 === 'number' && 6350000 > 1000
                              ? `₹${(6350000 / 1000000).toFixed(2)}M`
                              : 6350000}
                          </h3>
                          <div className={`flex items-center mt-1 ${'+22.1%'.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {'+22.1%'.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="text-sm">{'+22.1%'}</span>
                          </div>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-full">
                          <ShoppingCart className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Visitors</p>
                          <h3 className="text-2xl font-bold mt-2">
                            {typeof 156000 === 'number' && 156000 > 1000
                              ? `₹${(156000 / 1000000).toFixed(2)}M`
                              : 156000}
                          </h3>
                          <div className={`flex items-center mt-1 ${'+16.4%'.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {'+16.4%'.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="text-sm">{'+16.4%'}</span>
                          </div>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                          <h3 className="text-2xl font-bold mt-2">
                            {'3.2%'}
                          </h3>
                          <div className={`flex items-center mt-1 ${'+0.4%'.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {'+0.4%'.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="text-sm">{'+0.4%'}</span>
                          </div>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Target className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <Pie
                    data={{
                      labels: ['Physical Stores', 'Online Store'],
                      datasets: [{
                        data: [8900000, 6350000],
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(34, 197, 94, 0.8)'
                        ]
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Performance Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <Line
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                      datasets: [
                        {
                          label: 'Physical Stores',
                          data: [1.2, 1.3, 1.4, 1.5, 1.6, 1.7].map(x => x * 1000000),
                          borderColor: 'rgb(59, 130, 246)',
                        },
                        {
                          label: 'Online Store',
                          data: [0.8, 0.9, 1.1, 1.2, 1.3, 1.4].map(x => x * 1000000),
                          borderColor: 'rgb(34, 197, 94)',
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}