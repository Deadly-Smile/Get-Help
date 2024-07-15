<?php

namespace Database\Seeders;

use App\Models\PermisssionRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionRoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionRoles = [
            ['permission_id' => 1, 'role_id' => 3],
            ['permission_id' => 1, 'role_id' => 4],
            ['permission_id' => 2, 'role_id' => 3],
            ['permission_id' => 2, 'role_id' => 4],
            ['permission_id' => 3, 'role_id' => 4],
            ['permission_id' => 4, 'role_id' => 2],
            ['permission_id' => 4, 'role_id' => 3],
            ['permission_id' => 4, 'role_id' => 4],
            ['permission_id' => 5, 'role_id' => 3],
            ['permission_id' => 5, 'role_id' => 4],
            ['permission_id' => 6, 'role_id' => 2],
            ['permission_id' => 6, 'role_id' => 3],
            ['permission_id' => 6, 'role_id' => 4],
            ['permission_id' => 7, 'role_id' => 1],
            ['permission_id' => 7, 'role_id' => 2],
            ['permission_id' => 7, 'role_id' => 3],
            ['permission_id' => 7, 'role_id' => 4],
            ['permission_id' => 8, 'role_id' => 1],
            ['permission_id' => 8, 'role_id' => 2],
            ['permission_id' => 8, 'role_id' => 3],
            ['permission_id' => 8, 'role_id' => 4],
            ['permission_id' => 9, 'role_id' => 1],
            ['permission_id' => 9, 'role_id' => 2],
            ['permission_id' => 9, 'role_id' => 3],
            ['permission_id' => 9, 'role_id' => 4],
            ['permission_id' => 10, 'role_id' => 1],
            ['permission_id' => 10, 'role_id' => 2],
            ['permission_id' => 10, 'role_id' => 3],
            ['permission_id' => 10, 'role_id' => 4],
            ['permission_id' => 11, 'role_id' => 1],
            ['permission_id' => 11, 'role_id' => 2],
            ['permission_id' => 11, 'role_id' => 3],
            ['permission_id' => 11, 'role_id' => 4],
            ['permission_id' => 12, 'role_id' => 3],
            ['permission_id' => 12, 'role_id' => 4],
        ];

        foreach ($permissionRoles as $permissionRole) {
            DB::table('permission_role')->insert(['permission_id' => $permissionRole['permission_id'], 'role_id' => $permissionRole['role_id'], 'created_at' => now(), 'updated_at' => null]);
        }
    }
}
