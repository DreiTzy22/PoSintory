<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $fillable = [
        'name',
        'domain',
        'plan',
        'status',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    public function suppliers()
    {
        return $this->hasMany(Supplier::class);
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }
}
