<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class Sale extends Model
{
    /** @use HasFactory<\Database\Factories\SaleFactory> */
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'user_id',
        'total_amount',
        'payment_method',
        'status',
        'tenant_id',
    ];

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }
}
