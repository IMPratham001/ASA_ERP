<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
        'discount_amount',
        'tax_rate',
        'tax_amount',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Get profit for this item
    public function getProfitAttribute()
    {
        if (!$this->product) {
            return 0;
        }
        
        return ($this->unit_price - $this->product->purchase_price) * $this->quantity;
    }

    // Get profit margin percentage
    public function getProfitMarginAttribute()
    {
        if (!$this->product || $this->unit_price <= 0) {
            return 0;
        }

        $profit = $this->unit_price - $this->product->purchase_price;
        return ($profit / $this->unit_price) * 100;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($orderItem) {
            // Calculate total price if not set
            if (empty($orderItem->total_price)) {
                $subtotal = $orderItem->unit_price * $orderItem->quantity;
                $discount = $orderItem->discount_amount ?? 0;
                $tax = $orderItem->tax_amount ?? 0;
                
                $orderItem->total_price = $subtotal - $discount + $tax;
            }
        });

        static::updating(function ($orderItem) {
            // Recalculate total price on update
            $subtotal = $orderItem->unit_price * $orderItem->quantity;
            $discount = $orderItem->discount_amount ?? 0;
            $tax = $orderItem->tax_amount ?? 0;
            
            $orderItem->total_price = $subtotal - $discount + $tax;
        });
    }
}