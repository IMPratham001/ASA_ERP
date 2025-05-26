
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TestController extends Controller
{
    public function apiStatus(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'ASA ERP API is running successfully',
            'timestamp' => now(),
            'version' => '1.0.0',
            'database_connection' => $this->testDatabaseConnection(),
            'endpoints' => [
                'authentication' => '/api/auth/*',
                'customers' => '/api/customers',
                'products' => '/api/products',
                'websocket' => 'ws://0.0.0.0:8080'
            ]
        ]);
    }

    public function databaseTest(): JsonResponse
    {
        try {
            $stats = [
                'customers_count' => Customer::count(),
                'products_count' => Product::count(),
                'database_tables' => $this->getTableCounts()
            ];

            return response()->json([
                'success' => true,
                'message' => 'Database connection successful',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database connection failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function testDatabaseConnection(): bool
    {
        try {
            \DB::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function getTableCounts(): array
    {
        $tables = ['companies', 'customers', 'products', 'categories', 'invoices', 'accounts', 'transactions'];
        $counts = [];

        foreach ($tables as $table) {
            try {
                $counts[$table] = \DB::table($table)->count();
            } catch (\Exception $e) {
                $counts[$table] = 'error';
            }
        }

        return $counts;
    }
}
