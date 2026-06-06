<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Super Admin (No tenant_id)
        User::factory()->create([
            'name' => 'System Admin',
            'email' => 'admin@posintory.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'tenant_id' => null,
        ]);

        // Default Tenant
        $tenant = \App\Models\Tenant::create([
            'name' => 'Demo Store',
            'plan' => 'pro',
        ]);

        // Tenant Admin
        User::factory()->create([
            'name' => 'Store Manager',
            'email' => 'manager@demo.com',
            'password' => Hash::make('password'),
            'role' => 'tenant_admin',
            'tenant_id' => $tenant->id,
        ]);
    }
}
