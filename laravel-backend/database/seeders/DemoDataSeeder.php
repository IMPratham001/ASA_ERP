
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Inventory;

class DemoDataSeeder extends Seeder
{
    public function run()
    {
        // Add customers
        $customers = [
            ['name' => 'John Doe', 'email' => 'john@example.com', 'phone' => '1234567890', 'address' => '123 Main St'],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'phone' => '0987654321', 'address' => '456 Oak Ave'],
            ['name' => 'Bob Wilson', 'email' => 'bob@example.com', 'phone' => '5555555555', 'address' => '789 Pine Rd']
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }

        // Add invoices
        $invoices = [
            [
                'customer_id' => 1,
                'number' => 'INV-001',
                'date' => now(),
                'due_date' => now()->addDays(30),
                'status' => 'paid',
                'items' => json_encode([
                    ['product_id' => 1, 'quantity' => 2, 'price' => 100]
                ]),
                'total' => 200
            ],
            [
                'customer_id' => 2,
                'number' => 'INV-002',
                'date' => now(),
                'due_date' => now()->addDays(30),
                'status' => 'pending',
                'items' => json_encode([
                    ['product_id' => 2, 'quantity' => 1, 'price' => 150]
                ]),
                'total' => 150
            ]
        ];

        foreach ($invoices as $invoice) {
            Invoice::create($invoice);
        }
    }
}
