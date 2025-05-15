
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index()
    {
        return response()->json(Inventory::with('product')->get());
    }

    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->update($request->validated());
        return response()->json($inventory);
    }

    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $inventory = Inventory::findOrFail($id);
        $inventory->quantity = $request->quantity;
        $inventory->save();

        return response()->json($inventory);
    }
}
