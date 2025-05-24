<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard/stats', function () {
    return response()->json([
        'status' => 'success',
        'data' => [
            'overview' => [
                'totalRevenue' => 45231.89,
                'customers' => 2350,
                'orders' => 12234,
                'inventory' => 573
            ],
            'recentSales' => [],
            'monthlyRevenue' => [],
            'topProducts' => []
        ]
    ]);
});