<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TestController;

Route::get('/test-connection', [TestController::class, 'testConnection']);
Route::get('/dashboard/stats', [App\Http\Controllers\API\DashboardController::class, 'getStats']);
Route::get('/test', [App\Http\Controllers\API\TestController::class, 'test']);