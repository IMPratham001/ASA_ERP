
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = [
        'product_id',
        'quantity',
        'min_quantity',
        'location',
        'batch_number',
        'expiry_date',
    ];

    protected $casts = [
        'expiry_date' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
