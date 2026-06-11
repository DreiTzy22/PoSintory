<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Seeding test branches...\n";

// Get first tenant
$tenant = \App\Models\Tenant::first();
if (!$tenant) {
    echo "No tenant found!\n";
    exit(1);
}
echo "Tenant found: {$tenant->name}\n";

// Create some branches
$branchesData = [
    [
        'name' => 'Main Branch',
        'location' => '123 Main St',
        'phone' => '555-1234',
        'email' => 'main@example.com',
        'tenant_id' => $tenant->id,
    ],
    [
        'name' => 'Downtown Branch',
        'location' => '456 Downtown Ave',
        'phone' => '555-5678',
        'email' => 'downtown@example.com',
        'tenant_id' => $tenant->id,
    ],
];

foreach ($branchesData as $data) {
    $branch = \App\Models\Branch::firstOrCreate(['name' => $data['name']], $data);
    echo "Created/Found branch: {$branch->name} (ID: {$branch->id})\n";
}

echo "Done!\n";
