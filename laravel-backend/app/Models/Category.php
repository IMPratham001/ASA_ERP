
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Category extends Model
{
    protected $fillable = [
        'id',
        'name',
        'slug',
        'description',
        'parentId'
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parentId');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parentId');
    }
}
