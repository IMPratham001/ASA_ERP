
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory;

class InventoryController extends Controller
{
    public function index()
    {
        return Inventory::with('product')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0'
        ]);

        return Inventory::create($validated);
    }

    public function update(Request $request, Inventory $inventory)
    {
        $validated = $request->validate([
            'quantity' => 'integer|min:0',
            'unit_price' => 'numeric|min:0'
        ]);

        $inventory->update($validated);
        return $inventory;
    }
}
