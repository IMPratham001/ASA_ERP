
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\{
    AuthController,
    StoreController,
    CustomerController,
    DashboardController,
    FinanceController
};

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Test endpoint
Route::get('/test', function() {
    return response()->json([
        'message' => 'API is working',
        'timestamp' => now(),
        'environment' => config('app.env')
    ]);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'current']);
    Route::apiResource('stores', StoreController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::prefix('finance')->group(function () {
        Route::get('/transactions', [FinanceController::class, 'index']);
        Route::post('/transactions', [FinanceController::class, 'store']);
        Route::get('/budget', [FinanceController::class, 'budget']);
        Route::put('/budget', [FinanceController::class, 'updateBudget']);
    });
});
