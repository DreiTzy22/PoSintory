<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class Ticket extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'subject',
        'description',
        'priority',
        'status',
        'category',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
