
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function rules()
    {
        return [
            'date' => 'required|date',
            'description' => 'required|string',
            'debit_account_id' => 'required|exists:accounts,id',
            'credit_account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric|min:0',
            'reference' => 'nullable|string',
            'store_id' => 'required|exists:stores,id'
        ];
    }
}
