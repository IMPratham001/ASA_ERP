
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class TestController extends Controller
{
    public function testDatabase(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            return response()->json([
                'status' => 'success',
                'message' => 'Database connection successful',
                'connection' => DB::connection()->getDatabaseName()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Database connection failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

class TestController extends Controller
{
    public function test()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'API is working',
            'timestamp' => now(),
            'test_data' => [
                'users' => rand(100, 1000),
                'transactions' => rand(1000, 5000),
                'revenue' => rand(10000, 50000)
            ]
        ]);
    }
}
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class TestController extends Controller
{
    public function testConnection(): JsonResponse
    {
        try {
            // Test raw connection
            DB::select('SELECT 1 as result');
            
            // Test tables
            $tables = [
                'customers' => DB::table('customers')->count(),
                'invoices' => DB::table('invoices')->count(),
                'inventory' => DB::table('inventory')->count(),
            ];
            
            return response()->json([
                'status' => 'success',
                'message' => 'Database connection successful',
                'tables' => $tables
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Database connection failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
