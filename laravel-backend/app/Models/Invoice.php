<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'customer_id',
        'order_id',
        'user_id',
        'invoice_number',
        'invoice_date',
        'due_date',
        'status',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'paid_amount',
        'balance_amount',
        'payment_status',
        'payment_terms',
        'notes',
        'terms_conditions',
        'sent_at',
        'paid_at',
    ];

    protected $casts = [
        'invoice_date' => 'datetime',
        'due_date' => 'datetime',
        'sent_at' => 'datetime',
        'paid_at' => 'datetime',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance_amount' => 'decimal:2',
    ];

    // Status constants
    const STATUS_DRAFT = 'draft';
    const STATUS_SENT = 'sent';
    const STATUS_VIEWED = 'viewed';
    const STATUS_PAID = 'paid';
    const STATUS_PARTIAL = 'partial';
    const STATUS_OVERDUE = 'overdue';
    const STATUS_CANCELLED = 'cancelled';

    // Payment status constants
    const PAYMENT_PENDING = 'pending';
    const PAYMENT_PARTIAL = 'partial';
    const PAYMENT_PAID = 'paid';
    const PAYMENT_OVERDUE = 'overdue';
    const PAYMENT_CANCELLED = 'cancelled';

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function invoiceItems(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    // Scope for overdue invoices
    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->where('payment_status', '!=', self::PAYMENT_PAID);
    }

    // Scope for paid invoices
    public function scopePaid($query)
    {
        return $query->where('payment_status', self::PAYMENT_PAID);
    }

    // Scope for pending invoices
    public function scopePending($query)
    {
        return $query->where('payment_status', self::PAYMENT_PENDING);
    }

    // Check if invoice is overdue
    public function getIsOverdueAttribute()
    {
        return $this->due_date < now() && $this->payment_status !== self::PAYMENT_PAID;
    }

    // Get days overdue
    public function getDaysOverdueAttribute()
    {
        if (!$this->is_overdue) {
            return 0;
        }
        
        return now()->diffInDays($this->due_date);
    }

    // Get total profit for invoice
    public function getTotalProfitAttribute()
    {
        return $this->invoiceItems->sum(function ($item) {
            return ($item->unit_price - $item->product->purchase_price) * $item->quantity;
        });
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            if (empty($invoice->invoice_number)) {
                $invoice->invoice_number = 'INV-' . date('Y') . '-' . str_pad(
                    Invoice::where('company_id', $invoice->company_id)
                        ->whereYear('created_at', date('Y'))
                        ->count() + 1,
                    6,
                    '0',
                    STR_PAD_LEFT
                );
            }

            if (empty($invoice->invoice_date)) {
                $invoice->invoice_date = now();
            }

            if (empty($invoice->due_date)) {
                $invoice->due_date = now()->addDays(30);
            }

            if (empty($invoice->status)) {
                $invoice->status = self::STATUS_DRAFT;
            }

            if (empty($invoice->payment_status)) {
                $invoice->payment_status = self::PAYMENT_PENDING;
            }
        });

        static::updating(function ($invoice) {
            // Update balance amount
            $invoice->balance_amount = $invoice->total_amount - $invoice->paid_amount;

            // Update payment status based on amounts
            if ($invoice->paid_amount >= $invoice->total_amount) {
                $invoice->payment_status = self::PAYMENT_PAID;
                if (!$invoice->paid_at) {
                    $invoice->paid_at = now();
                }
            } elseif ($invoice->paid_amount > 0) {
                $invoice->payment_status = self::PAYMENT_PARTIAL;
            } elseif ($invoice->due_date < now()) {
                $invoice->payment_status = self::PAYMENT_OVERDUE;
            } else {
                $invoice->payment_status = self::PAYMENT_PENDING;
            }
        });
    }
}