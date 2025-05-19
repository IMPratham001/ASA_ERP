
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class TestController extends Controller
{
    public function testConnection()
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
