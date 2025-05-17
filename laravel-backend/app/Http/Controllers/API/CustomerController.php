
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use League\Csv\Reader;
use League\Csv\Writer;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        $customers = Customer::all();
        return response()->json($customers);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:customers',
            'customer_type' => 'required|in:business,individual',
            // Add other validation rules as needed
        ]);

        $customer = Customer::create($request->all());
        return response()->json($customer, 201);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            // Add other validation rules as needed
        ]);

        $customer->update($request->all());
        return response()->json($customer);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $customer->delete();
        return response()->json(null, 204);
    }

    public function export(): JsonResponse
    {
        $customers = Customer::all();
        $csv = Writer::createFromString('');
        
        // Add headers
        $csv->insertOne([
            'Name', 'Email', 'Phone', 'Work Phone', 'Mobile', 'Address',
            'Customer Type', 'Company Name', 'Website', 'Status'
        ]);
        
        // Add data
        foreach ($customers as $customer) {
            $csv->insertOne([
                $customer->name,
                $customer->email,
                $customer->phone,
                $customer->work_phone,
                $customer->mobile,
                $customer->address,
                $customer->customer_type,
                $customer->company_name,
                $customer->website,
                $customer->status
            ]);
        }
        
        return response()->json([
            'csv' => $csv->toString(),
            'filename' => 'customers-' . date('Y-m-d') . '.csv'
        ]);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $csv = Reader::createFromPath($file->getPathname());
        $csv->setHeaderOffset(0);

        $records = $csv->getRecords();
        $imported = 0;

        foreach ($records as $record) {
            try {
                Customer::create([
                    'name' => $record['Name'] ?? '',
                    'email' => $record['Email'] ?? '',
                    'phone' => $record['Phone'] ?? '',
                    'work_phone' => $record['Work Phone'] ?? '',
                    'mobile' => $record['Mobile'] ?? '',
                    'address' => $record['Address'] ?? '',
                    'customer_type' => $record['Customer Type'] ?? 'business',
                    'company_name' => $record['Company Name'] ?? '',
                    'website' => $record['Website'] ?? '',
                    'status' => $record['Status'] ?? 'active'
                ]);
                $imported++;
            } catch (\Exception $e) {
                continue;
            }
        }

        return response()->json([
            'message' => "Successfully imported $imported customers",
            'imported_count' => $imported
        ]);
    }
}
