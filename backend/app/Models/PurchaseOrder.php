<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class PurchaseOrder extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'supplier_id',
        'total_amount',
        'status',
        'order_date',
        'expected_date',
        'notes',
        'tenant_id',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
