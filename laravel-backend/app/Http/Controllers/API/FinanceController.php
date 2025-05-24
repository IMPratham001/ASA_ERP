
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Models\Transaction;
use App\Events\FinancialTransactionCreated;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function createTransaction(StoreTransactionRequest $request)
    {
        $data = $request->validated();
        
        if ($data['is_recurring'] ?? false) {
            $schedule = $this->createRecurringSchedule($data);
            $data['schedule_id'] = $schedule->id;
        }

        // Handle GST calculations
        if ($data['has_gst']) {
            $data = $this->calculateGST($data);
        }

        $transaction = Transaction::create($data);
        event(new FinancialTransactionCreated($transaction));
        
        return response()->json($transaction, 201);
    }

    protected function calculateGST($data)
    {
        $amount = $data['amount'];
        $gstRate = $data['gst_rate'];
        $isInterstate = $data['is_interstate'] ?? false;

        if ($isInterstate) {
            $data['igst'] = $amount * ($gstRate / 100);
        } else {
            $data['cgst'] = $amount * ($gstRate / 200);
            $data['sgst'] = $amount * ($gstRate / 200);
        }

        return $data;
    }

    public function getTransactions(Request $request)
    {
        $transactions = Transaction::with(['account', 'store'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        return response()->json($transactions);
    }

    public function getDashboardStats()
    {
        $stats = [
            'total_revenue' => Transaction::revenue()->sum('amount'),
            'total_expenses' => Transaction::expenses()->sum('amount'),
            'recent_transactions' => Transaction::latest()->take(5)->get(),
            'cash_flow' => $this->calculateCashFlow()
        ];
        return response()->json($stats);
    }

    private function calculateCashFlow()
    {
        // Weekly cash flow for the last month
        $start = now()->subMonth();
        $end = now();
        
        return Transaction::whereBetween('created_at', [$start, $end])
            ->selectRaw('WEEK(created_at) as week')
            ->selectRaw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as inflow')
            ->selectRaw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as outflow')
            ->groupBy('week')
            ->get();
    }
}
