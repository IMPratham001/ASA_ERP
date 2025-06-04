<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'product_id',
        'description',
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

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
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

    // Get subtotal before tax and discount
    public function getSubtotalAttribute()
    {
        return $this->unit_price * $this->quantity;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoiceItem) {
            // Auto-fill description from product if not provided
            if (empty($invoiceItem->description) && $invoiceItem->product) {
                $invoiceItem->description = $invoiceItem->product->name;
            }

            // Calculate total price if not set
            if (empty($invoiceItem->total_price)) {
                $subtotal = $invoiceItem->unit_price * $invoiceItem->quantity;
                $discount = $invoiceItem->discount_amount ?? 0;
                $tax = $invoiceItem->tax_amount ?? 0;
                
                $invoiceItem->total_price = $subtotal - $discount + $tax;
            }
        });

        static::updating(function ($invoiceItem) {
            // Recalculate total price on update
            $subtotal = $invoiceItem->unit_price * $invoiceItem->quantity;
            $discount = $invoiceItem->discount_amount ?? 0;
            $tax = $invoiceItem->tax_amount ?? 0;
            
            $invoiceItem->total_price = $subtotal - $discount + $tax;
        });
    }
}