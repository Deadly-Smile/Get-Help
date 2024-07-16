<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleUserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roleUserArr = [
            ['user_id' => 1, 'role_id' => 3],
            ['user_id' => 2, 'role_id' => 1]
        ];

        foreach ($roleUserArr as $userRole) {
            DB::table('role_user')->insert(['user_id' => $userRole['user_id'], 'role_id' => $userRole['role_id']]);
        }
    }
}
