
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        try {
            // Fetch real data from database
            $stats = [
                'data' => [
                    'overview' => [
                        'totalRevenue' => DB::table('invoices')->sum('total_amount') ?? 0,
                        'customers' => DB::table('customers')->count() ?? 0,
                        'orders' => DB::table('orders')->count() ?? 0,
                        'inventory' => DB::table('inventory')->sum('quantity') ?? 0
                    ],
                    'recentSales' => DB::table('invoices')
                        ->orderBy('created_at', 'desc')
                        ->limit(5)
                        ->get()
                        ->map(function($sale) {
                            return [
                                'id' => $sale->id,
                                'amount' => number_format($sale->total_amount, 2)
                            ];
                        })
                ]
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch dashboard stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
