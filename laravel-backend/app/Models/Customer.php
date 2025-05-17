
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'work_phone',
        'mobile',
        'address',
        'billing_address',
        'shipping_address',
        'website',
        'customer_type',
        'company_name',
        'primary_contact',
        'salutation',
        'first_name',
        'last_name',
        'currency',
        'payment_terms',
        'portal_language',
        'portal_access',
        'status',
        'remarks',
        'country',
        'state',
        'city',
        'zip_code',
        'fax'
    ];

    protected $casts = [
        'portal_access' => 'boolean',
    ];
}
