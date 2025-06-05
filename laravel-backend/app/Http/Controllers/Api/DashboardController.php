<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = Cache::remember('dashboard_stats', 300, function () {
                return [
                    'total_users' => DB::table('users')->count(),
                    'total_orders' => DB::table('orders')->count(),
                    'total_revenue' => DB::table('orders')
                        ->where('status', '!=', 'cancelled')
                        ->sum('total_amount'),
                    'pending_orders' => DB::table('orders')
                        ->where('status', 'pending')
                        ->count(),
                    'total_products' => DB::table('products')->count(),
                    'low_stock_products' => DB::table('products')
                        ->where('stock_quantity', '<=', DB::raw('minimum_stock'))
                        ->count()
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $stats,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch dashboard stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard overview
     */
    public function overview(): JsonResponse
    {
        try {
            $today = Carbon::today();
            $thisWeek = Carbon::now()->startOfWeek();
            $thisMonth = Carbon::now()->startOfMonth();

            $overview = [
                'revenue' => [
                    'today' => DB::table('orders')
                        ->whereDate('created_at', $today)
                        ->where('status', '!=', 'cancelled')
                        ->sum('total_amount'),
                    'this_week' => DB::table('orders')
                        ->where('created_at', '>=', $thisWeek)
                        ->where('status', '!=', 'cancelled')
                        ->sum('total_amount'),
                    'this_month' => DB::table('orders')
                        ->where('created_at', '>=', $thisMonth)
                        ->where('status', '!=', 'cancelled')
                        ->sum('total_amount')
                ],
                'orders' => [
                    'today' => DB::table('orders')->whereDate('created_at', $today)->count(),
                    'this_week' => DB::table('orders')->where('created_at', '>=', $thisWeek)->count(),
                    'this_month' => DB::table('orders')->where('created_at', '>=', $thisMonth)->count()
                ],
                'customers' => [
                    'total' => DB::table('users')->where('role', 'customer')->count(),
                    'new_this_month' => DB::table('users')
                        ->where('role', 'customer')
                        ->where('created_at', '>=', $thisMonth)
                        ->count()
                ]
            ];

            return response()->json([
                'status' => 'success',
                'data' => $overview,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch overview',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sales performance data
     */
    public function salesPerformance(): JsonResponse
    {
        try {
            $salesData = DB::table('orders')
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(total_amount) as sales'),
                    DB::raw('COUNT(*) as order_count')
                )
                ->where('created_at', '>=', Carbon::now()->subDays(30))
                ->where('status', '!=', 'cancelled')
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date', 'desc')
                ->limit(30)
                ->get();

            // Calculate growth rate
            $currentMonth = DB::table('orders')
                ->where('created_at', '>=', Carbon::now()->startOfMonth())
                ->where('status', '!=', 'cancelled')
                ->sum('total_amount');

            $lastMonth = DB::table('orders')
                ->whereBetween('created_at', [
                    Carbon::now()->subMonth()->startOfMonth(),
                    Carbon::now()->subMonth()->endOfMonth()
                ])
                ->where('status', '!=', 'cancelled')
                ->sum('total_amount');

            $growthRate = $lastMonth > 0 ? (($currentMonth - $lastMonth) / $lastMonth) * 100 : 0;

            return response()->json([
                'status' => 'success',
                'data' => [
                    'daily_sales' => $salesData,
                    'growth_rate' => round($growthRate, 2)
                ],
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch sales performance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get category distribution
     */
    public function categoryDistribution(): JsonResponse
    {
        try {
            $categories = DB::table('products')
                ->join('order_items', 'products.id', '=', 'order_items.product_id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->select(
                    'products.category',
                    DB::raw('COUNT(order_items.id) as count'),
                    DB::raw('SUM(order_items.quantity * order_items.price) as revenue')
                )
                ->where('orders.status', '!=', 'cancelled')
                ->groupBy('products.category')
                ->orderBy('revenue', 'desc')
                ->get();

            $total = $categories->sum('count');
            
            $categoryData = $categories->map(function ($category) use ($total) {
                return [
                    'category' => $category->category ?? 'Uncategorized',
                    'count' => $category->count,
                    'revenue' => $category->revenue,
                    'percentage' => $total > 0 ? round(($category->count / $total) * 100, 1) : 0
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $categoryData,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch category distribution',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get hourly traffic data (requires analytics/tracking table)
     */
    public function hourlyTraffic(): JsonResponse
    {
        try {
            // This assumes you have a page_views or analytics table
            // If not, you can track this with orders or user logins
            $traffic = DB::table('page_views')
                ->select(
                    DB::raw('HOUR(created_at) as hour'),
                    DB::raw('COUNT(DISTINCT user_id) as visitors'),
                    DB::raw('COUNT(*) as page_views')
                )
                ->whereDate('created_at', Carbon::today())
                ->groupBy(DB::raw('HOUR(created_at)'))
                ->orderBy('hour')
                ->get()
                ->keyBy('hour');

            // Fill missing hours with 0
            $hourlyData = [];
            for ($hour = 0; $hour < 24; $hour++) {
                $hourlyData[] = [
                    'hour' => sprintf('%02d:00', $hour),
                    'visitors' => $traffic->get($hour)->visitors ?? 0,
                    'page_views' => $traffic->get($hour)->page_views ?? 0
                ];
            }

            return response()->json([
                'status' => 'success',
                'data' => $hourlyData,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            // Fallback to order-based traffic if page_views table doesn't exist
            $orderTraffic = DB::table('orders')
                ->select(
                    DB::raw('HOUR(created_at) as hour'),
                    DB::raw('COUNT(*) as orders')
                )
                ->whereDate('created_at', Carbon::today())
                ->groupBy(DB::raw('HOUR(created_at)'))
                ->get()
                ->keyBy('hour');

            $hourlyData = [];
            for ($hour = 0; $hour < 24; $hour++) {
                $hourlyData[] = [
                    'hour' => sprintf('%02d:00', $hour),
                    'orders' => $orderTraffic->get($hour)->orders ?? 0
                ];
            }

            return response()->json([
                'status' => 'success',
                'data' => $hourlyData,
                'message' => 'Using order data as traffic proxy',
                'timestamp' => now()
            ]);
        }
    }

    /**
     * Get performance metrics
     */
    public function performanceMetrics(): JsonResponse
    {
        try {
            // Database performance metrics
            $dbSize = DB::select("SELECT 
                ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'db_size_mb'
                FROM information_schema.tables 
                WHERE table_schema = DATABASE()")[0]->db_size_mb ?? 0;

            $activeConnections = DB::select("SHOW STATUS LIKE 'Threads_connected'")[0]->Value ?? 0;
            
            // Cache hit rate (if using Redis)
            $cacheStats = [];
            try {
                if (Cache::getStore() instanceof \Illuminate\Cache\RedisStore) {
                    $redis = Cache::getStore()->getRedis();
                    $info = $redis->info();
                    $cacheStats = [
                        'hits' => $info['keyspace_hits'] ?? 0,
                        'misses' => $info['keyspace_misses'] ?? 0,
                        'hit_rate' => ($info['keyspace_hits'] ?? 0) / max(1, ($info['keyspace_hits'] ?? 0) + ($info['keyspace_misses'] ?? 0)) * 100
                    ];
                }
            } catch (\Exception $e) {
                // Cache stats not available
            }

            $metrics = [
                'database_size_mb' => $dbSize,
                'active_connections' => $activeConnections,
                'average_response_time' => $this->getAverageResponseTime(),
                'uptime_percentage' => 99.9, // You'd calculate this from logs
                'active_users_today' => DB::table('users')
                    ->whereDate('last_login_at', Carbon::today())
                    ->count(),
                'cache_stats' => $cacheStats
            ];

            return response()->json([
                'status' => 'success',
                'data' => $metrics,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch performance metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get top products
     */
    public function topProducts(): JsonResponse
    {
        try {
            $topProducts = DB::table('products')
                ->join('order_items', 'products.id', '=', 'order_items.product_id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->select(
                    'products.id',
                    'products.name',
                    DB::raw('SUM(order_items.quantity) as total_sold'),
                    DB::raw('SUM(order_items.quantity * order_items.price) as revenue'),
                    DB::raw('COUNT(DISTINCT order_items.order_id) as order_count')
                )
                ->where('orders.status', '!=', 'cancelled')
                ->where('orders.created_at', '>=', Carbon::now()->subDays(30))
                ->groupBy('products.id', 'products.name')
                ->orderBy('revenue', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $topProducts,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch top products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent sales
     */
    public function recentSales(): JsonResponse
    {
        try {
            $recentSales = DB::table('orders')
                ->join('users', 'orders.user_id', '=', 'users.id')
                ->select(
                    'orders.id',
                    'orders.order_number',
                    'users.name as customer_name',
                    'users.email as customer_email',
                    'orders.total_amount',
                    'orders.status',
                    'orders.created_at'
                )
                ->orderBy('orders.created_at', 'desc')
                ->limit(20)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $recentSales,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch recent sales',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system status
     */
    public function systemStatus(): JsonResponse
    {
        try {
            $status = [
                'database_status' => $this->checkDatabaseStatus(),
                'cache_status' => $this->checkCacheStatus(),
                'queue_status' => $this->checkQueueStatus(),
                'storage_status' => $this->checkStorageStatus(),
                'last_backup' => $this->getLastBackupTime(),
                'server_load' => sys_getloadavg()[0] ?? 'unknown',
                'memory_usage' => $this->getMemoryUsage(),
                'disk_usage' => $this->getDiskUsage()
            ];

            return response()->json([
                'status' => 'success',
                'data' => $status,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch system status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get inventory alerts
     */
    public function inventoryAlerts(): JsonResponse
    {
        try {
            $alerts = DB::table('products')
                ->select(
                    'id',
                    'name',
                    'stock_quantity as current_stock',
                    'minimum_stock',
                    DB::raw("CASE 
                        WHEN stock_quantity = 0 THEN 'out_of_stock'
                        WHEN stock_quantity <= minimum_stock THEN 'low_stock'
                        ELSE 'normal'
                    END as alert_type"),
                    DB::raw("CASE 
                        WHEN stock_quantity = 0 THEN 'critical'
                        WHEN stock_quantity <= (minimum_stock * 0.5) THEN 'high'
                        WHEN stock_quantity <= minimum_stock THEN 'medium'
                        ELSE 'low'
                    END as priority")
                )
                ->where(function($query) {
                    $query->where('stock_quantity', '=', 0)
                          ->orWhereRaw('stock_quantity <= minimum_stock');
                })
                ->orderByRaw("CASE 
                    WHEN stock_quantity = 0 THEN 1
                    WHEN stock_quantity <= (minimum_stock * 0.5) THEN 2
                    WHEN stock_quantity <= minimum_stock THEN 3
                    ELSE 4
                END")
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $alerts,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch inventory alerts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get revenue by month
     */
    public function revenueByMonth(): JsonResponse
    {
        try {
            $revenueData = DB::table('orders')
                ->select(
                    DB::raw('YEAR(created_at) as year'),
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('MONTHNAME(created_at) as month_name'),
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('COUNT(*) as order_count')
                )
                ->where('status', '!=', 'cancelled')
                ->where('created_at', '>=', Carbon::now()->subMonths(12))
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $revenueData,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch revenue by month',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get customer growth data
     */
    public function customerGrowth(): JsonResponse
    {
        try {
            $growthData = DB::table('users')
                ->select(
                    DB::raw('YEAR(created_at) as year'),
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('MONTHNAME(created_at) as month_name'),
                    DB::raw('COUNT(*) as new_customers')
                )
                ->where('role', 'customer')
                ->where('created_at', '>=', Carbon::now()->subMonths(12))
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->get();

            // Add running total
            $totalCustomers = 0;
            $growthData = $growthData->reverse()->map(function ($item) use (&$totalCustomers) {
                $totalCustomers += $item->new_customers;
                $item->total_customers = $totalCustomers;
                return $item;
            })->reverse();

            return response()->json([
                'status' => 'success',
                'data' => $growthData,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch customer growth',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get orders by status
     */
    public function ordersByStatus(): JsonResponse
    {
        try {
            $statusData = DB::table('orders')
                ->select(
                    'status',
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('status')
                ->get();

            $total = $statusData->sum('count');
            
            $statusData = $statusData->map(function ($item) use ($total) {
                $item->percentage = $total > 0 ? round(($item->count / $total) * 100, 1) : 0;
                return $item;
            });

            return response()->json([
                'status' => 'success',
                'data' => $statusData,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch orders by status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get geographic data
     */
    public function geographicData(): JsonResponse
    {
        try {
            // This assumes you have country/location data in orders or users table
            $geoData = DB::table('orders')
                ->join('users', 'orders.user_id', '=', 'users.id')
                ->select(
                    'users.country',
                    DB::raw('COUNT(orders.id) as order_count'),
                    DB::raw('SUM(orders.total_amount) as revenue')
                )
                ->where('orders.status', '!=', 'cancelled')
                ->whereNotNull('users.country')
                ->groupBy('users.country')
                ->orderBy('revenue', 'desc')
                ->limit(20)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $geoData,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch geographic data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Helper methods
    private function checkDatabaseStatus(): string
    {
        try {
            DB::select('SELECT 1');
            return 'operational';
        } catch (\Exception $e) {
            return 'down';
        }
    }

    private function checkCacheStatus(): string
    {
        try {
            Cache::put('health_check', 'ok', 1);
            return Cache::get('health_check') === 'ok' ? 'operational' : 'degraded';
        } catch (\Exception $e) {
            return 'down';
        }
    }

    private function checkQueueStatus(): string
    {
        try {
            // This depends on your queue driver
            return 'operational'; // Implement based on your queue system
        } catch (\Exception $e) {
            return 'unknown';
        }
    }

    private function checkStorageStatus(): string
    {
        try {
            $diskFree = disk_free_space('/');
            return $diskFree > 1000000000 ? 'operational' : 'low_space'; // 1GB threshold
        } catch (\Exception $e) {
            return 'unknown';
        }
    }

    private function getLastBackupTime(): ?string
    {
        // Implement based on your backup system
        return null;
    }

    private function getAverageResponseTime(): float
    {
        // You'd implement this based on your logging system
        return 0.0;
    }

    private function getMemoryUsage(): array
    {
        return [
            'used' => memory_get_usage(true),
            'peak' => memory_get_peak_usage(true),
            'limit' => ini_get('memory_limit')
        ];
    }

    private function getDiskUsage(): array
    {
        $bytes = disk_free_space('/');
        $totalBytes = disk_total_space('/');
        
        return [
            'free' => $bytes,
            'total' => $totalBytes,
            'used' => $totalBytes - $bytes,
            'percentage' => round((($totalBytes - $bytes) / $totalBytes) * 100, 2)
        ];
    }
}