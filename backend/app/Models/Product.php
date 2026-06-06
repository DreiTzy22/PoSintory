<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'name',
        'sku',
        'description',
        'price',
        'stock',
        'alert_threshold',
        'image',
        'tenant_id',
    ];

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
}
