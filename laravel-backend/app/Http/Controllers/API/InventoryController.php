
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class InventoryController extends Controller
{
    public function index()
    {
        try {
            $inventory = Inventory::with('product')
                ->orderBy('updated_at', 'desc')
                ->paginate(20);
            
            return response()->json($inventory);
        } catch (\Exception $e) {
            Log::error('Inventory fetch error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch inventory'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'quantity' => 'required|integer|min:0',
                'min_quantity' => 'required|integer|min:0',
                'location' => 'required|string|max:255',
                'batch_number' => 'nullable|string|max:50',
                'expiry_date' => 'nullable|date'
            ]);

            $inventory = Inventory::findOrFail($id);
            $inventory->update($validated);

            return response()->json($inventory->load('product'));
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Inventory update error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update inventory'], 500);
        }
    }

    public function updateStock(Request $request, $id)
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:0',
            ]);

            $inventory = Inventory::findOrFail($id);
            $oldQuantity = $inventory->quantity;
            $inventory->quantity = $request->quantity;
            $inventory->save();

            // Log stock change
            Log::info("Stock updated for product {$inventory->product_id}", [
                'old_quantity' => $oldQuantity,
                'new_quantity' => $request->quantity,
                'user_id' => auth()->id()
            ]);

            return response()->json($inventory->load('product'));
        } catch (\Exception $e) {
            Log::error('Stock update error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update stock'], 500);
        }
    }

    public function lowStock()
    {
        try {
            $lowStock = Inventory::with('product')
                ->whereRaw('quantity <= min_quantity')
                ->get();
                
            return response()->json($lowStock);
        } catch (\Exception $e) {
            Log::error('Low stock check error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to check low stock'], 500);
        }
    }
}
