
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class InventoryController extends Controller
{
    public function import(Request $request)
    {
        try {
            $file = $request->file('file');
            $data = json_decode(file_get_contents($file), true);
            
            foreach ($data as $item) {
                Inventory::updateOrCreate(
                    ['productId' => $item['productId']],
                    $item
                );
            }
            
            return response()->json(['message' => 'Import successful']);
        } catch (\Exception $e) {
            Log::error('Import error: ' . $e->getMessage());
            return response()->json(['error' => 'Import failed'], 500);
        }
    }

    public function export($format)
    {
        try {
            $inventory = Inventory::with('product')->get();
            
            switch ($format) {
                case 'json':
                    return response()->json($inventory);
                case 'csv':
                    $headers = [
                        'Content-Type' => 'text/csv',
                        'Content-Disposition' => 'attachment; filename="inventory.csv"'
                    ];
                    $callback = function() use ($inventory) {
                        $file = fopen('php://output', 'w');
                        fputcsv($file, ['ID', 'Product ID', 'Quantity', 'Location', 'Last Updated']);
                        foreach ($inventory as $item) {
                            fputcsv($file, [$item->id, $item->productId, $item->quantity, $item->location, $item->lastUpdated]);
                        }
                        fclose($file);
                    };
                    return response()->stream($callback, 200, $headers);
                default:
                    return response()->json(['error' => 'Unsupported format'], 400);
            }
        } catch (\Exception $e) {
            Log::error('Export error: ' . $e->getMessage());
            return response()->json(['error' => 'Export failed'], 500);
        }
    }
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
