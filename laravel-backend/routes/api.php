<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\AuditController;
use App\Http\Controllers\Api\SystemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no authentication required)
Route::prefix('system')->group(function () {
    Route::get('status', [SystemController::class, 'status']);
});

// Audit logging (public for login attempts)
Route::prefix('audit')->group(function () {
    Route::post('log', [AuditController::class, 'log']);
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('sso-init', [AuthController::class, 'ssoInit']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Customer routes
    Route::apiResource('customers', CustomerController::class);

    // Product routes
    Route::apiResource('products', ProductController::class);
    Route::put('products/{product}/stock', [ProductController::class, 'updateStock']);

    // Protected system routes
    Route::prefix('system')->group(function () {
        Route::get('database-test', [TestController::class, 'databaseTest']);
        Route::get('health', [TestController::class, 'apiStatus']);
    });
});