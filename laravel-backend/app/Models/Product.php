<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'category_id',
        'name',
        'sku',
        'description',
        'barcode',
        'purchase_price',
        'selling_price',
        'mrp',
        'unit',
        'stock_quantity',
        'min_stock_level',
        'stock_status',
        'weight',
        'dimensions',
        'images',
        'gst_rate',
        'hsn_code',
        'is_active',
        'attributes',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'mrp' => 'decimal:2',
        'weight' => 'decimal:2',
        'gst_rate' => 'decimal:2',
        'is_active' => 'boolean',
        'dimensions' => 'array',
        'images' => 'array',
        'attributes' => 'array',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function invoiceItems(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    // Get total sales quantity
    public function getTotalSalesQuantityAttribute()
    {
        return $this->orderItems()->sum('quantity');
    }

    // Get total sales revenue
    public function getTotalSalesRevenueAttribute()
    {
        return $this->orderItems()->sum('total_price');
    }

    // Get profit margin
    public function getProfitMarginAttribute()
    {
        if ($this->selling_price <= 0) {
            return 0;
        }
        
        $profit = $this->selling_price - $this->purchase_price;
        return ($profit / $this->selling_price) * 100;
    }

    // Check if product is low stock
    public function getIsLowStockAttribute()
    {
        return $this->stock_quantity <= $this->min_stock_level;
    }

    // Check if product is out of stock
    public function getIsOutOfStockAttribute()
    {
        return $this->stock_quantity <= 0;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->sku)) {
                $product->sku = 'PRD-' . str_pad(
                    Product::where('company_id', $product->company_id)->count() + 1,
                    6,
                    '0',
                    STR_PAD_LEFT
                );
            }
        });

        static::updating(function ($product) {
            // Update stock status based on quantity
            if ($product->stock_quantity <= 0) {
                $product->stock_status = 'out_of_stock';
            } elseif ($product->stock_quantity <= $product->min_stock_level) {
                $product->stock_status = 'low_stock';
            } else {
                $product->stock_status = 'in_stock';
            }
        });
    }
}