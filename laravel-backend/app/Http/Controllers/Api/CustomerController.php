
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Events\CustomerUpdated;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $search = $request->get('search');
        
        $query = Customer::with('company')
            ->where('company_id', $request->user()->company_id);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('customer_code', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $customers
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'gst_number' => 'nullable|string|max:15',
            'customer_type' => 'required|in:individual,business',
            'credit_limit' => 'nullable|numeric|min:0',
            'additional_info' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $customer = Customer::create([
            'company_id' => $request->user()->company_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'gst_number' => $request->gst_number,
            'customer_type' => $request->customer_type,
            'credit_limit' => $request->credit_limit ?? 0,
            'additional_info' => $request->additional_info
        ]);

        // Broadcast customer created event
        broadcast(new CustomerUpdated($customer, 'created'));

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'data' => $customer->load('company')
        ], 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        // Check if customer belongs to user's company
        if ($customer->company_id !== auth()->user()->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $customer->load(['company', 'invoices'])
        ]);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        // Check if customer belongs to user's company
        if ($customer->company_id !== auth()->user()->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|unique:customers,email,' . $customer->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'gst_number' => 'nullable|string|max:15',
            'customer_type' => 'sometimes|required|in:individual,business',
            'credit_limit' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'additional_info' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $customer->update($request->only([
            'name', 'email', 'phone', 'address', 'gst_number',
            'customer_type', 'credit_limit', 'is_active', 'additional_info'
        ]));

        // Broadcast customer updated event
        broadcast(new CustomerUpdated($customer, 'updated'));

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data' => $customer->load('company')
        ]);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        // Check if customer belongs to user's company
        if ($customer->company_id !== auth()->user()->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        // Check if customer has any invoices
        if ($customer->invoices()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete customer with existing invoices'
            ], 400);
        }

        // Broadcast customer deleted event before deletion
        broadcast(new CustomerUpdated($customer, 'deleted'));
        
        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully'
        ]);
    }
}
