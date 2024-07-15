<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Subscriber', 'slug' => 'subscriber'],
            ['name' => 'Doctor', 'slug' => 'doctor'],
            ['name' => 'Admin', 'slug' => 'admin'],
            ['name' => 'Master', 'slug' => 'master'],
        ];

        foreach ($roles as $role) {
            Role::create([
                'name' => $role['name'],
                'slug' => $role['slug'],
            ]);
        }
    }
}
