
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\{
    TestController,
    DashboardController,
    CustomerController,
    InventoryController,
    InvoiceController,
    PDFController,
    UserController
};

// CORS middleware
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// API Routes
Route::middleware(['api'])->group(function () {
    // Auth routes
    Route::post('/auth/login', [UserController::class, 'login']);
    Route::post('/auth/logout', [UserController::class, 'logout']);
    
    // Protected routes
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
        Route::apiResource('customers', CustomerController::class);
        Route::apiResource('inventory', InventoryController::class);
        Route::apiResource('invoices', InvoiceController::class);
        Route::get('/pdf/invoice/{id}', [PDFController::class, 'generateInvoice']);
    });
});
