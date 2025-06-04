<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'customer_id',
        'user_id',
        'order_number',
        'order_date',
        'status',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'payment_status',
        'payment_method',
        'notes',
        'shipping_address',
        'billing_address',
        'expected_delivery_date',
        'delivered_at',
    ];

    protected $casts = [
        'order_date' => 'datetime',
        'expected_delivery_date' => 'datetime',
        'delivered_at' => 'datetime',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'shipping_address' => 'array',
        'billing_address' => 'array',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SHIPPED = 'shipped';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';

    // Payment status constants
    const PAYMENT_PENDING = 'pending';
    const PAYMENT_PARTIAL = 'partial';
    const PAYMENT_PAID = 'paid';
    const PAYMENT_REFUNDED = 'refunded';

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    // Scope for active orders
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [self::STATUS_CANCELLED]);
    }

    // Scope for completed orders
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_DELIVERED);
    }

    // Scope for paid orders
    public function scopePaid($query)
    {
        return $query->where('payment_status', self::PAYMENT_PAID);
    }

    // Get total quantity of items in order
    public function getTotalQuantityAttribute()
    {
        return $this->orderItems->sum('quantity');
    }

    // Get total profit for order
    public function getTotalProfitAttribute()
    {
        return $this->orderItems->sum(function ($item) {
            return ($item->unit_price - $item->product->purchase_price) * $item->quantity;
        });
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . date('Y') . '-' . str_pad(
                    Order::where('company_id', $order->company_id)
                        ->whereYear('created_at', date('Y'))
                        ->count() + 1,
                    6,
                    '0',
                    STR_PAD_LEFT
                );
            }

            if (empty($order->order_date)) {
                $order->order_date = now();
            }

            if (empty($order->status)) {
                $order->status = self::STATUS_PENDING;
            }

            if (empty($order->payment_status)) {
                $order->payment_status = self::PAYMENT_PENDING;
            }
        });
    }
}