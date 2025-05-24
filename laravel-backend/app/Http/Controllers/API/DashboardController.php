
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats()
    {
        return response()->json([
            'total_customers' => \App\Models\Customer::count(),
            'total_invoices' => \App\Models\Invoice::count(),
            'total_revenue' => \App\Models\Invoice::sum('total_amount'),
        ]);
    }
}
