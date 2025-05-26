
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Events\ProductUpdated;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $search = $request->get('search');
        $categoryId = $request->get('category_id');
        
        $query = Product::with(['company', 'category'])
            ->where('company_id', $request->user()->company_id);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'barcode' => 'nullable|string|unique:products,barcode',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'mrp' => 'nullable|numeric|min:0',
            'unit' => 'required|string|max:50',
            'stock_quantity' => 'required|integer|min:0',
            'min_stock_level' => 'nullable|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'images' => 'nullable|array',
            'gst_rate' => 'required|numeric|min:0|max:100',
            'hsn_code' => 'nullable|string|max:20',
            'attributes' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::create([
            'company_id' => $request->user()->company_id,
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
            'barcode' => $request->barcode,
            'purchase_price' => $request->purchase_price,
            'selling_price' => $request->selling_price,
            'mrp' => $request->mrp ?? $request->selling_price,
            'unit' => $request->unit,
            'stock_quantity' => $request->stock_quantity,
            'min_stock_level' => $request->min_stock_level ?? 0,
            'weight' => $request->weight,
            'dimensions' => $request->dimensions,
            'images' => $request->images,
            'gst_rate' => $request->gst_rate,
            'hsn_code' => $request->hsn_code,
            'attributes' => $request->attributes
        ]);

        // Broadcast product created event
        broadcast(new ProductUpdated($product, 'created'));

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product->load(['company', 'category'])
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        // Check if product belongs to user's company
        if ($product->company_id !== auth()->user()->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product->load(['company', 'category'])
        ]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        // Check if product belongs to user's company
        if ($product->company_id !== auth()->user()->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'barcode' => 'nullable|string|unique:products,barcode,' . $product->id,
            'purchase_price' => 'sometimes|required|numeric|min:0',
            'selling_price' => 'sometimes|required|numeric|min:0',
            'mrp' => 'nullable|numeric|min:0',
            'unit' => 'sometimes|required|string|max:50',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'min_stock_level' => 'nullable|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'images' => 'nullable|array',
            'gst_rate' => 'sometimes|required|numeric|min:0|max:100',
            'hsn_code' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'attributes' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product->update($request->only([
            'category_id', 'name', 'description', 'barcode', 'purchase_price',
            'selling_price', 'mrp', 'unit', 'stock_quantity', 'min_stock_level',
            'weight', 'dimensions', 'images', 'gst_rate', 'hsn_code',
            'is_active', 'attributes'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product->load(['company', 'category'])
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        // Check if product belongs to user's company
        if ($product->company_id !== auth()->user()->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Check if product has any invoice items
        if ($product->invoiceItems()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete product with existing invoice items'
            ], 400);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    public function updateStock(Request $request, Product $product): JsonResponse
    {
        // Check if product belongs to user's company
        if ($product->company_id !== auth()->user()->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer',
            'type' => 'required|in:add,subtract,set'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $currentStock = $product->stock_quantity;
        $quantity = $request->quantity;

        switch ($request->type) {
            case 'add':
                $newStock = $currentStock + $quantity;
                break;
            case 'subtract':
                $newStock = max(0, $currentStock - $quantity);
                break;
            case 'set':
                $newStock = max(0, $quantity);
                break;
        }

        $product->update(['stock_quantity' => $newStock]);

        return response()->json([
            'success' => true,
            'message' => 'Stock updated successfully',
            'data' => [
                'previous_stock' => $currentStock,
                'new_stock' => $newStock,
                'product' => $product->load(['company', 'category'])
            ]
        ]);
    }
}
