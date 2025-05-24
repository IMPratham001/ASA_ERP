
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;

class FinanceController extends Controller
{
    public function index()
    {
        return response()->json(['transactions' => Transaction::all()]);
    }

    public function store(StoreTransactionRequest $request)
    {
        $transaction = Transaction::create($request->validated());
        event(new \App\Events\FinancialTransactionCreated($transaction));
        return response()->json($transaction, 201);
    }

    public function show($id)
    {
        return response()->json(['transaction' => Transaction::findOrFail($id)]);
    }

    public function update(UpdateTransactionRequest $request, $id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->update($request->validated());
        return response()->json($transaction);
    }

    public function destroy($id)
    {
        Transaction::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
