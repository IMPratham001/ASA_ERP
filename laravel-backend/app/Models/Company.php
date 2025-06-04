<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'gst_number',
        'pan_number',
        'logo',
        'settings',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function pdfTemplates(): HasMany
    {
        return $this->hasMany(PdfTemplate::class);
    }

    // Get total revenue from orders
    public function getTotalRevenueAttribute()
    {
        return $this->orders()->sum('total_amount');
    }

    // Get total customers count
    public function getTotalCustomersAttribute()
    {
        return $this->customers()->count();
    }

    // Get total products count
    public function getTotalProductsAttribute()
    {
        return $this->products()->count();
    }

    // Get total orders count
    public function getTotalOrdersAttribute()
    {
        return $this->orders()->count();
    }

    // Get total invoices count
    public function getTotalInvoicesAttribute()
    {
        return $this->invoices()->count();
    }

    // Get pending invoices amount
    public function getPendingInvoicesAmountAttribute()
    {
        return $this->invoices()->where('payment_status', 'pending')->sum('total_amount');
    }

    // Get low stock products count
    public function getLowStockProductsCountAttribute()
    {
        return $this->products()->whereColumn('stock_quantity', '<=', 'min_stock_level')->count();
    }

    // Get out of stock products count
    public function getOutOfStockProductsCountAttribute()
    {
        return $this->products()->where('stock_quantity', '<=', 0)->count();
    }
}