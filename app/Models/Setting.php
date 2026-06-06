<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class Setting extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'key',
        'value',
        'tenant_id',
    ];
}
