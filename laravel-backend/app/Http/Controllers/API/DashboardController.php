<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Inventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getStats(): JsonResponse
    {
        try {
            $currentMonth = Carbon::now()->month;

            $stats = [
                'overview' => [
                    'totalRevenue' => Invoice::sum('total'),
                    'customers' => Customer::count(),
                    'orders' => Invoice::count(),
                    'inventory' => Inventory::sum('quantity')
                ],
                'recentSales' => Invoice::with('customer')
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(),
                'monthlyRevenue' => Invoice::select(
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('SUM(total) as total')
                )
                ->whereYear('created_at', Carbon::now()->year)
                ->groupBy('month')
                ->get()
                ->pluck('total', 'month')
                ->toArray(),
                'topProducts' => DB::table('invoice_items')
                    ->join('products', 'invoice_items.product_id', '=', 'products.id')
                    ->select(
                        'products.name',
                        DB::raw('SUM(invoice_items.quantity) as total_sold'),
                        DB::raw('SUM(invoice_items.quantity * invoice_items.price) as revenue')
                    )
                    ->groupBy('products.id', 'products.name')
                    ->orderBy('revenue', 'desc')
                    ->take(4)
                    ->get()
            ];

            return response()->json([
                'status' => 'success',
                'data' => $stats,
                'message' => 'Dashboard statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}