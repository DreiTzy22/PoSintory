<?php

namespace App\Traits;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

/**
 * @mixin \Illuminate\Database\Eloquent\Model
 */
trait BelongsToTenant
{
    protected static function bootBelongsToTenant()
    {
        static::creating(function ($model) {
            if (Auth::check()) {
                $user = Auth::user();
                if ($user && isset($user->role) && $user->role !== 'super_admin' && !isset($model->tenant_id)) {
                    $model->tenant_id = $user->tenant_id;
                }
            }
        });

        static::addGlobalScope('tenant', function (Builder $builder) {
            if (Auth::hasUser()) {
                $user = Auth::user();
                if ($user && isset($user->role) && $user->role !== 'super_admin') {
                    $builder->where($builder->getQuery()->from . '.tenant_id', $user->tenant_id);
                }
            }
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
