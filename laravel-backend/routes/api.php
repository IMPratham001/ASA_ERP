<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\FinanceController;

// Finance Routes
Route::prefix('finance')->group(function () {
    Route::get('/transactions', [FinanceController::class, 'getTransactions']);
    Route::post('/transactions', [FinanceController::class, 'createTransaction']);
    Route::get('/dashboard/stats', [FinanceController::class, 'getDashboardStats']);
});
use App\Http\Controllers\API\{
    TestController,
    DashboardController,
    CustomerController,
    InventoryController,
    InvoiceController,
    PDFController,
    UserController
};
use App\Http\Controllers\API\FinanceController;

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

        // PDF Routes
        Route::prefix('pdf')->group(function () {
            Route::post('/generate', [PDFController::class, 'generate']);
            Route::post('/preview', [PDFController::class, 'preview']);
            Route::post('/download', [PDFController::class, 'download']);
        });

        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // Finance routes
        Route::apiResource('finance/transactions', FinanceController::class);
        Route::get('finance/reports/trial-balance', [FinanceController::class, 'trialBalance']);
        Route::get('finance/reports/income-statement', [FinanceController::class, 'incomeStatement']);
        Route::get('finance/reports/balance-sheet', [FinanceController::class, 'balanceSheet']);
    });
});