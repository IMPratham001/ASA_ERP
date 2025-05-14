
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with(['customer', 'items.product'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->search, function($q, $search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', fn($q) => 
                      $q->where('name', 'like', "%{$search}%")
                  );
            });

        return $query->latest()->paginate(10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'store_id' => 'required|exists:stores,id',
            'due_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $invoice = Invoice::create([
                'customer_id' => $request->customer_id,
                'store_id' => $request->store_id,
                'invoice_number' => $this->generateInvoiceNumber(),
                'due_date' => $request->due_date,
                'status' => 'pending',
                'notes' => $request->notes,
            ]);

            $subtotal = 0;
            $totalTax = 0;

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $itemSubtotal = $item['quantity'] * $item['price'];
                $taxAmount = $itemSubtotal * ($product->tax_rate / 100);
                
                $invoice->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'tax_rate' => $product->tax_rate,
                    'tax_amount' => $taxAmount,
                    'subtotal' => $itemSubtotal,
                    'total' => $itemSubtotal + $taxAmount,
                ]);

                $subtotal += $itemSubtotal;
                $totalTax += $taxAmount;
            }

            $invoice->update([
                'subtotal' => $subtotal,
                'tax' => $totalTax,
                'total' => $subtotal + $totalTax,
            ]);

            DB::commit();
            return response()->json($invoice->load('items.product', 'customer'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Invoice $invoice)
    {
        return $invoice->load('items.product', 'customer', 'store');
    }

    public function update(Request $request, Invoice $invoice)
    {
        if ($invoice->status === 'paid') {
            return response()->json(['error' => 'Cannot update paid invoice'], 422);
        }

        $request->validate([
            'status' => 'sometimes|in:draft,pending,paid,overdue',
            'due_date' => 'sometimes|date',
            'notes' => 'sometimes|string',
        ]);

        $invoice->update($request->only(['status', 'due_date', 'notes']));
        return $invoice->fresh()->load('items.product', 'customer');
    }

    public function destroy(Invoice $invoice)
    {
        if ($invoice->status === 'paid') {
            return response()->json(['error' => 'Cannot delete paid invoice'], 422);
        }

        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted successfully']);
    }

    private function generateInvoiceNumber()
    {
        $lastInvoice = Invoice::latest()->first();
        $number = $lastInvoice ? intval(substr($lastInvoice->invoice_number, 3)) + 1 : 1;
        return 'INV' . str_pad($number, 6, '0', STR_PAD_LEFT);
    }
}
