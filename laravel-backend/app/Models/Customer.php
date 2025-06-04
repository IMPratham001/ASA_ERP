<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'phone',
        'address',
        'gst_number',
        'customer_code',
        'customer_type',
        'credit_limit',
        'outstanding_balance',
        'is_active',
        'additional_info',
    ];

    protected $casts = [
        'credit_limit' => 'decimal:2',
        'outstanding_balance' => 'decimal:2',
        'is_active' => 'boolean',
        'additional_info' => 'array',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    // Get total orders count
    public function getTotalOrdersAttribute()
    {
        return $this->orders()->count();
    }

    // Get total orders value
    public function getTotalOrdersValueAttribute()
    {
        return $this->orders()->sum('total_amount');
    }

    // Get total invoices count
    public function getTotalInvoicesAttribute()
    {
        return $this->invoices()->count();
    }

    // Get total invoices value
    public function getTotalInvoicesValueAttribute()
    {
        return $this->invoices()->sum('total_amount');
    }

    // Get pending invoices
    public function getPendingInvoicesAttribute()
    {
        return $this->invoices()->where('payment_status', 'pending')->sum('total_amount');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer) {
            if (empty($customer->customer_code)) {
                $customer->customer_code = 'CUST-' . str_pad(
                    Customer::where('company_id', $customer->company_id)->count() + 1,
                    6,
                    '0',
                    STR_PAD_LEFT
                );
            }
        });
    }
}