<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TestController;
use App\Http\Controllers\API\UserController;

// Auth routes
Route::post('/auth/login', [UserController::class, 'login']);
Route::post('/auth/register', [UserController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [UserController::class, 'logout']);
    Route::get('/auth/me', [UserController::class, 'me']);
    
    // Protected routes
    Route::get('/test-connection', [TestController::class, 'testConnection']);
    Route::get('/dashboard/stats', [App\Http\Controllers\API\DashboardController::class, 'getStats']);
    Route::get('/test', [App\Http\Controllers\API\TestController::class, 'test']);
});