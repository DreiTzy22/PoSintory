<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class Supplier extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'name',
        'contact_person',
        'email',
        'phone',
        'address',
        'tenant_id',
    ];
}
