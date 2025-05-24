
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    private $gstRates = [5, 12, 18, 28];

    public function storeTransaction(StoreTransactionRequest $request)
    {
        $data = $request->validated();
        
        // Calculate GST based on rate and location
        $gstAmount = $this->calculateGST(
            $data['amount'],
            $data['gst_rate'],
            $data['source_state'],
            $data['destination_state']
        );
        
        $transaction = Transaction::create([
            ...$data,
            'gst_amount' => $gstAmount['total'],
            'cgst_amount' => $gstAmount['cgst'],
            'sgst_amount' => $gstAmount['sgst'],
            'igst_amount' => $gstAmount['igst'],
        ]);

        // Handle recurring transactions if specified
        if (isset($data['is_recurring']) && $data['is_recurring']) {
            $this->createRecurringSchedule($transaction, $data['frequency']);
        }

        return response()->json($transaction, 201);
    }

    private function calculateGST($amount, $rate, $sourceState, $destState)
    {
        if (!in_array($rate, $this->gstRates)) {
            throw new \InvalidArgumentException('Invalid GST rate');
        }

        $totalGST = ($amount * $rate) / 100;

        // For inter-state transactions: IGST
        if ($sourceState !== $destState) {
            return [
                'total' => $totalGST,
                'igst' => $totalGST,
                'cgst' => 0,
                'sgst' => 0
            ];
        }

        // For intra-state transactions: CGST + SGST
        $halfGST = $totalGST / 2;
        return [
            'total' => $totalGST,
            'igst' => 0,
            'cgst' => $halfGST,
            'sgst' => $halfGST
        ];
    }

    private function createRecurringSchedule($transaction, $frequency)
    {
        $validFrequencies = ['daily', 'weekly', 'monthly'];
        if (!in_array($frequency, $validFrequencies)) {
            throw new \InvalidArgumentException('Invalid frequency');
        }

        // Create recurring schedule based on frequency
        $schedule = new \App\Models\RecurringSchedule([
            'transaction_id' => $transaction->id,
            'frequency' => $frequency,
            'next_date' => $this->calculateNextDate($frequency),
            'is_active' => true
        ]);

        $schedule->save();
    }

    private function calculateNextDate($frequency)
    {
        $now = now();
        return match($frequency) {
            'daily' => $now->addDay(),
            'weekly' => $now->addWeek(),
            'monthly' => $now->addMonth(),
            default => $now
        };
    }
}
