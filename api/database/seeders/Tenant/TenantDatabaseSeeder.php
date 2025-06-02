<?php

namespace Database\Seeders\Tenant;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TenantDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Example: Seed a default admin role and user
        $admin = \App\Models\TenantUser::create([
            'name' => 'Tenant Admin',
            'email' => 'admint' . tenant('id') . '@example.com',
            'password' => Hash::make('password'),
        ]);

        // $role = Role::firstOrCreate(['name' => 'admin']);
        // $admin->assignRole($role);
    }
}