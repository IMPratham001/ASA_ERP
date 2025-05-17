
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Store;

class DemoDataSeeder extends Seeder
{
    public function run()
    {
        // Add customers
        $customers = [
            ['name' => 'John Doe', 'email' => 'john@example.com', 'phone' => '1234567890', 'address' => '123 Main St', 'company_name' => 'Tech Corp'],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'phone' => '0987654321', 'address' => '456 Oak Ave', 'company_name' => 'Design Co'],
            ['name' => 'Bob Wilson', 'email' => 'bob@example.com', 'phone' => '5555555555', 'address' => '789 Pine Rd', 'company_name' => 'Marketing LLC']
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }

        // Add categories
        $categories = [
            ['name' => 'Electronics', 'description' => 'Electronic devices and accessories'],
            ['name' => 'Office Supplies', 'description' => 'Office essentials'],
            ['name' => 'Furniture', 'description' => 'Office furniture']
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Add brands
        $brands = [
            ['name' => 'TechBrand', 'description' => 'Leading tech manufacturer'],
            ['name' => 'OfficePro', 'description' => 'Professional office equipment'],
            ['name' => 'FurnCraft', 'description' => 'Quality furniture maker']
        ];

        foreach ($brands as $brand) {
            Brand::create($brand);
        }

        // Add stores
        $stores = [
            ['name' => 'Main Store', 'location' => 'Downtown'],
            ['name' => 'Branch Store', 'location' => 'Uptown'],
            ['name' => 'Warehouse', 'location' => 'Industrial Zone']
        ];

        foreach ($stores as $store) {
            Store::create($store);
        }

        // Add products
        $products = [
            [
                'name' => 'Laptop Pro',
                'sku' => 'LAP001',
                'description' => 'High-performance laptop',
                'price' => 999.99,
                'stock' => 50,
                'categoryId' => 1,
                'brandId' => 1
            ],
            [
                'name' => 'Office Chair',
                'sku' => 'CHR001',
                'description' => 'Ergonomic office chair',
                'price' => 199.99,
                'stock' => 30,
                'categoryId' => 3,
                'brandId' => 3
            ],
            [
                'name' => 'Printer',
                'sku' => 'PRN001',
                'description' => 'Color laser printer',
                'price' => 299.99,
                'stock' => 20,
                'categoryId' => 1,
                'brandId' => 2
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
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
                    ['product_id' => 1, 'quantity' => 2, 'price' => 999.99]
                ]),
                'total' => 1999.98
            ],
            [
                'customer_id' => 2,
                'number' => 'INV-002',
                'date' => now(),
                'due_date' => now()->addDays(30),
                'status' => 'pending',
                'items' => json_encode([
                    ['product_id' => 2, 'quantity' => 3, 'price' => 199.99],
                    ['product_id' => 3, 'quantity' => 1, 'price' => 299.99]
                ]),
                'total' => 899.96
            ]
        ];

        foreach ($invoices as $invoice) {
            Invoice::create($invoice);
        }
    }
}
