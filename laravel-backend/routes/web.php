<?php

use Illuminate\Support\Facades\Route;

// Serve welcome page
Route::get('/', function () {
    return view('welcome');
});

// This route is required by Sanctum for CSRF protection
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});
