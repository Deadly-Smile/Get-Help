<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userArray = [
            [
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'test@test.com',
                'password' => '1234567890',
                'email_verified_at' => now(),
                'pending_subscriber' => false,
            ],
            [
                'name' => 'Subscriber',
                'username' => 'subscriber',
                'email' => 'example@test.com',
                'password' => '1234567890',
                'email_verified_at' => now(),
                'pending_subscriber' => false,
            ],
        ];

        foreach ($userArray as $user) {
            User::create([
                'name' => $user['name'],
                'username' => $user['username'],
                'password' => $user['password'],
                'email' => $user['email'],
                'email_verified_at' => $user['email_verified_at'],
                'pending_subscriber' => $user['pending_subscriber'],
            ]);
        }
    }
}
