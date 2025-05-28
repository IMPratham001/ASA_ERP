<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Events\CustomerUpdated;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class CustomerController extends Controller
{
    /**
     * Display a listing of the customers.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Customer::query();

            // Search functionality
            if ($request->has('search')) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->get('status'));
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $customers = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $customers,
                'message' => 'Customers retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving customers',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Store a newly created customer in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:customers',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'company' => 'nullable|string|max:255',
                'status' => 'nullable|in:active,inactive',
                'notes' => 'nullable|string|max:1000'
            ]);

            $validated['status'] = $validated['status'] ?? 'active';

            $customer = Customer::create($validated);

            return response()->json([
                'success' => true,
                'data' => $customer,
                'message' => 'Customer created successfully'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating customer',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $customer,
                'message' => 'Customer retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving customer',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update the specified customer in storage.
     */
    public function update(Request $request, Customer $customer): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:customers,email,' . $customer->id,
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'company' => 'nullable|string|max:255',
                'status' => 'nullable|in:active,inactive',
                'notes' => 'nullable|string|max:1000'
            ]);

            $customer->update($validated);

            // Fire event for customer update
            event(new CustomerUpdated($customer));

            return response()->json([
                'success' => true,
                'data' => $customer->fresh(),
                'message' => 'Customer updated successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating customer',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Remove the specified customer from storage.
     */
    public function destroy(Customer $customer): JsonResponse
    {
        try {
            $customer->delete();

            return response()->json([
                'success' => true,
                'message' => 'Customer deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting customer',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}