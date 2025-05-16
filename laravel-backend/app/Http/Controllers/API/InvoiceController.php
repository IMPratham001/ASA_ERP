
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        $invoice = new Invoice([
            'customer_id' => $request->customer_id,
            'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'due_date' => $request->due_date,
            'notes' => $request->notes
        ]);

        $subtotal = 0;
        foreach ($request->items as $item) {
            $subtotal += $item['quantity'] * $item['price'];
        }

        $tax = $subtotal * 0.10; // 10% tax
        $total = $subtotal + $tax;

        $invoice->subtotal = $subtotal;
        $invoice->tax = $tax;
        $invoice->total = $total;
        $invoice->save();

        foreach ($request->items as $item) {
            $invoice->items()->create($item);
        }

        return response()->json([
            'message' => 'Invoice created successfully',
            'invoice' => $invoice->load('items', 'customer')
        ], 201);
    }
}
