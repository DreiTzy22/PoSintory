<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class Customer extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'credit_limit',
        'balance',
        'tenant_id',
        'branch_id',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
