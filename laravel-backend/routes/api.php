<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\StoreController;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\DashboardController;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'current']);
    Route::apiResource('stores', StoreController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});