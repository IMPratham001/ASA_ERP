<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard overview statistics
     */
    public function overview(Request $request)
    {
        try {
            $from = $request->get('from', Carbon::now()->subMonth());
            $to = $request->get('to', Carbon::now());
            
            // Convert string dates to Carbon instances if needed
            if (is_string($from)) {
                $from = Carbon::parse($from);
            }
            if (is_string($to)) {
                $to = Carbon::parse($to);
            }

            // Calculate previous period for comparison
            $daysDiff = $from->diffInDays($to);
            $previousFrom = $from->copy()->subDays($daysDiff);
            $previousTo = $from->copy();

            // Current period data
            $currentRevenue = $this->getTotalRevenue($from, $to);
            $currentCustomers = $this->getTotalCustomers($from, $to);
            $currentOrders = $this->getTotalOrders($from, $to);
            $currentInventory = $this->getTotalInventory();

            // Previous period data for comparison
            $previousRevenue = $this->getTotalRevenue($previousFrom, $previousTo);
            $previousCustomers = $this->getTotalCustomers($previousFrom, $previousTo);
            $previousOrders = $this->getTotalOrders($previousFrom, $previousTo);
            $previousInventory = $this->getTotalInventory(); // Could be enhanced with historical data

            // Calculate percentage changes
            $revenueChange = $this->calculatePercentageChange($previousRevenue, $currentRevenue);
            $customersChange = $this->calculatePercentageChange($previousCustomers, $currentCustomers);
            $ordersChange = $this->calculatePercentageChange($previousOrders, $currentOrders);
            $inventoryChange = $this->calculatePercentageChange($previousInventory, $currentInventory);

            return response()->json([
                'totalRevenue' => $currentRevenue,
                'customers' => $currentCustomers,
                'orders' => $currentOrders,
                'inventory' => $currentInventory,
                'revenueChange' => $revenueChange,
                'customersChange' => $customersChange,
                'ordersChange' => $ordersChange,
                'inventoryChange' => $inventoryChange,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch overview data: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get sales performance data for charts
     */
    public function salesPerformance(Request $request)
    {
        try {
            $from = $request->get('from', Carbon::now()->subMonth());
            $to = $request->get('to', Carbon::now());
            
            if (is_string($from)) {
                $from = Carbon::parse($from);
            }
            if (is_string($to)) {
                $to = Carbon::parse($to);
            }

            // Get daily sales data
            $salesData = DB::table('orders')
                ->join('order_items', 'orders.id', '=', 'order_items.order_id')
                ->whereBetween('orders.created_at', [$from, $to])
                ->selectRaw('DATE(orders.created_at) as date')
                ->selectRaw('SUM(order_items.quantity * order_items.price) as revenue')
                ->selectRaw('SUM(order_items.quantity * (order_items.price - COALESCE(products.cost_price, order_items.price * 0.7))) as profit')
                ->leftJoin('products', 'order_items.product_id', '=', 'products.id')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $labels = $salesData->pluck('date')->map(function($date) {
                return Carbon::parse($date)->format('M d');
            })->toArray();
            $revenue = $salesData->pluck('revenue')->map(function($value) {
                return (float) $value;
            })->toArray();
            $profit = $salesData->pluck('profit')->map(function($value) {
                return (float) $value;
            })->toArray();

            return response()->json([
                'labels' => $labels,
                'revenue' => $revenue,
                'profit' => $profit,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch sales performance data: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get category distribution for pie chart
     */
    public function categoryDistribution()
    {
        try {
            $categories = DB::table('order_items')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->selectRaw('categories.name as category_name')
                ->selectRaw('SUM(order_items.quantity * order_items.price) as total_sales')
                ->groupBy('categories.id', 'categories.name')
                ->orderBy('total_sales', 'desc')
                ->get();

            $labels = $categories->pluck('category_name')->toArray();
            $data = $categories->pluck('total_sales')->map(function($value) {
                return (float) $value;
            })->toArray();

            return response()->json([
                'labels' => $labels,
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch category distribution: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get hourly traffic data
     */
    public function hourlyTraffic()
    {
        try {
            // Get order counts by hour for today
            $today = Carbon::today();
            $tomorrow = Carbon::tomorrow();

            $hourlyData = DB::table('orders')
                ->whereBetween('created_at', [$today, $tomorrow])
                ->selectRaw('HOUR(created_at) as hour')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('hour')
                ->orderBy('hour')
                ->get()
                ->keyBy('hour');

            $hours = [];
            $data = [];
            
            // Generate 24 hours of data
            for ($i = 0; $i < 24; $i++) {
                $hours[] = sprintf('%02d:00', $i);
                $data[] = isset($hourlyData[$i]) ? (int) $hourlyData[$i]->count : 0;
            }

            return response()->json([
                'labels' => $hours,
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch traffic data: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get performance metrics for radar chart
     */
    public function performanceMetrics()
    {
        try {
            $currentMonth = Carbon::now()->startOfMonth();
            $previousMonth = Carbon::now()->subMonth()->startOfMonth();
            $previousMonthEnd = Carbon::now()->subMonth()->endOfMonth();

            // Sales performance (current month vs previous month)
            $currentSales = $this->getTotalRevenue($currentMonth, Carbon::now());
            $previousSales = $this->getTotalRevenue($previousMonth, $previousMonthEnd);
            $salesPerformance = $previousSales > 0 ? ($currentSales / $previousSales) * 100 : 100;

            // Traffic (orders this month vs last month)
            $currentOrders = $this->getTotalOrders($currentMonth, Carbon::now());
            $previousOrders = $this->getTotalOrders($previousMonth, $previousMonthEnd);
            $trafficPerformance = $previousOrders > 0 ? ($currentOrders / $previousOrders) * 100 : 100;

            // Conversion rate (orders vs unique customers)
            $totalCustomers = $this->getTotalCustomers($currentMonth, Carbon::now());
            $conversionRate = $totalCustomers > 0 ? ($currentOrders / $totalCustomers) * 100 : 0;

            // Growth rate (month over month)
            $growthRate = $this->calculatePercentageChange($previousSales, $currentSales);

            // Customer retention (returning customers)
            $returningCustomers = DB::table('orders')
                ->select('user_id')
                ->whereBetween('created_at', [$currentMonth, Carbon::now()])
                ->groupBy('user_id')
                ->havingRaw('COUNT(*) > 1')
                ->count();
            
            $retentionRate = $totalCustomers > 0 ? ($returningCustomers / $totalCustomers) * 100 : 0;

            return response()->json([
                'sales' => min(100, max(0, $salesPerformance)),
                'traffic' => min(100, max(0, $trafficPerformance)),
                'conversion' => min(100, max(0, $conversionRate)),
                'growth' => min(100, max(0, $growthRate + 50)), // Normalize growth rate
                'retention' => min(100, max(0, $retentionRate)),
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch performance metrics: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get top products
     */
    public function topProducts(Request $request)
    {
        try {
            $limit = $request->get('limit', 10);
            
            $products = DB::table('products')
                ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
                ->select(
                    'products.id',
                    'products.name',
                    DB::raw('COALESCE(SUM(order_items.quantity), 0) as sales'),
                    DB::raw('COALESCE(SUM(order_items.quantity * order_items.price), 0) as revenue')
                )
                ->groupBy('products.id', 'products.name')
                ->orderBy('revenue', 'desc')
                ->limit($limit)
                ->get();

            return response()->json($products->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sales' => (int) $product->sales,
                    'revenue' => (float) $product->revenue
                ];
            }));

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch top products: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get recent sales
     */
    public function recentSales(Request $request)
    {
        try {
            $limit = $request->get('limit', 5);
            
            $sales = DB::table('orders')
                ->join('users', 'orders.user_id', '=', 'users.id')
                ->leftJoin('order_items', 'orders.id', '=', 'order_items.order_id')
                ->leftJoin('products', 'order_items.product_id', '=', 'products.id')
                ->select(
                    'orders.id',
                    'users.name as customerName',
                    DB::raw('GROUP_CONCAT(products.name SEPARATOR ", ") as productName'),
                    'orders.total as amount',
                    'orders.created_at as date'
                )
                ->groupBy('orders.id', 'users.name', 'orders.total', 'orders.created_at')
                ->orderBy('orders.created_at', 'desc')
                ->limit($limit)
                ->get();

            return response()->json($sales->map(function($sale) {
                return [
                    'id' => $sale->id,
                    'customerName' => $sale->customerName,
                    'productName' => $sale->productName ?: 'No products',
                    'amount' => (float) $sale->amount,
                    'date' => $sale->date
                ];
            }));

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch recent sales: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get system status
     */
    public function systemStatus()
    {
        try {
            $dbStatus = $this->checkDatabaseConnection();
            $orderCount = DB::table('orders')->count();
            $productCount = DB::table('products')->count();
            $userCount = DB::table('users')->count();
            
            $status = 'operational';
            if (!$dbStatus) {
                $status = 'error';
            } elseif ($orderCount === 0 && $productCount === 0) {
                $status = 'warning';
            }

            return response()->json([
                'status' => $status,
                'database' => $dbStatus ? 'connected' : 'disconnected',
                'orders_count' => $orderCount,
                'products_count' => $productCount,
                'users_count' => $userCount,
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'database' => 'disconnected',
                'error' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ]);
        }
    }

    /**
     * Get inventory alerts
     */
    public function inventoryAlerts()
    {
        try {
            $lowStockThreshold = 10; // You can make this configurable
            
            $alerts = DB::table('products')
                ->where('stock', '<', $lowStockThreshold)
                ->where('stock', '>', 0)
                ->select('name as productName', 'stock as currentStock')
                ->orderBy('stock', 'asc')
                ->get();

            return response()->json($alerts->map(function($alert) {
                return [
                    'productName' => $alert->productName,
                    'currentStock' => (int) $alert->currentStock,
                    'type' => 'low_stock'
                ];
            }));

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch inventory alerts: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Legacy stats method (keeping for backward compatibility)
     */
    public function stats(Request $request)
    {
        return $this->overview($request);
    }

    // Private helper methods
    private function getTotalRevenue($from, $to)
    {
        return DB::table('orders')
            ->whereBetween('created_at', [$from, $to])
            ->sum('total') ?? 0;
    }

    private function getTotalCustomers($from, $to)
    {
        return DB::table('orders')
            ->whereBetween('created_at', [$from, $to])
            ->distinct('user_id')
            ->count('user_id') ?? 0;
    }

    private function getTotalOrders($from, $to)
    {
        return DB::table('orders')
            ->whereBetween('created_at', [$from, $to])
            ->count() ?? 0;
    }

    private function getTotalInventory()
    {
        return DB::table('products')
            ->sum('stock') ?? 0;
    }

    private function calculatePercentageChange($previous, $current)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        return (($current - $previous) / $previous) * 100;
    }

    private function checkDatabaseConnection()
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}