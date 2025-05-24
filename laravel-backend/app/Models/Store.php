
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'status'
    ];

    public $incrementing = false;
    protected $keyType = 'string';
}
