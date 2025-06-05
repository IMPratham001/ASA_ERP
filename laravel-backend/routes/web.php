<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // Make sure this exists

// Serve welcome page
Route::get('/', function () {
    return view('welcome');
});

// Sanctum CSRF protection route
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
