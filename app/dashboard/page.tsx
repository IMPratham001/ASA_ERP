"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
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
} from "lucide-react";
import { Overview } from "@/components/dashboard/overview";
import { IntegrationTest } from "@/components/shared/integration-test";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Line, Doughnut, Bar, Radar } from "react-chartjs-2";
import { useEffect } from "react";
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

// Add the StoreSwitcher component
// const StoreSwitcher = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedStore, setSelectedStore] = useState("Main Store");

//   const stores = [
//     { id: 1, name: "Main Store" },
//     { id: 2, name: "Branch Store" },
//     { id: 3, name: "Online Store" },
//   ];

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-2 px-3 py-1 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
//       >
//         <Store className="h-4 w-4" />
//         {selectedStore}
//         <svg
//           width="12"
//           height="12"
//           viewBox="0 0 12 12"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
//         >
//           <path d="M6 8.5L2 4.5H10L6 8.5Z" fill="currentColor" />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute top-full mt-1 w-full py-1 rounded-md border bg-popover shadow-md z-50">
//           {stores.map((store) => (
//             <button
//               key={store.id}
//               className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
//               onClick={() => {
//                 setSelectedStore(store.name);
//                 setIsOpen(false);
//               }}
//             >
//               {store.name}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

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
        const response = await api.get("/dashboard/stats");
        if (response.data?.status === "success") {
          setDashboardData(response.data.data);
          setIsLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "success", title: "New Order" },
    { id: 2, type: "warning", title: "Low Stock" },
    { id: 3, type: "error", title: "Payment Failed" },
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <StoreSwitcher />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`h-3 w-3 rounded-full ${
                  notification.type === "success"
                    ? "bg-green-500"
                    : notification.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                } animate-pulse`}
                title={notification.title}
              />
            ))}
          </div>
          
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
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
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
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
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
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
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
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
            <div className="mt-4 h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500 rounded" />
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
      {/* Additional Metrics */}
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
    </div>
  );
}