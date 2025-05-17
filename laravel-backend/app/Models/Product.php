
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'id',
        'name',
        'sku',
        'description',
        'price',
        'stock',
        'minStock',
        'categoryId',
        'brandId',
        'warehouse',
        'taxClass',
        'metaTitle',
        'metaDescription',
        'customFields'
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
        'minStock' => 'integer',
        'customFields' => 'json'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }
}
