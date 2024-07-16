<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $permissions = [
            ['name' => 'Edit User Table', 'slug' => 'edit-user-table'],
            ['name' => 'Edit Doctor Table', 'slug' => 'edit-doctor-table'],
            ['name' => 'Edit Admin Table', 'slug' => 'edit-admin-table'],
            ['name' => 'Edit My Post', 'slug' => 'edit-my-post'],
            ['name' => 'Edit Post Table', 'slug' => 'edit-post-table'],
            ['name' => 'Create Post', 'slug' => 'create-post'],
            ['name' => 'Vote Post', 'slug' => 'vote-post'],
            ['name' => 'Comment Post', 'slug' => 'comment-post'],
            ['name' => 'Get Contacts', 'slug' => 'get-contacts'],
            ['name' => 'Get Messages', 'slug' => 'get-messages'],
            ['name' => 'Send Message', 'slug' => 'send-message'],
            ['name' => 'approve_or_delete_posts', 'slug' => 'approve_or_delete_posts'],
        ];

        foreach ($permissions as $permission) {
            Permission::create([
                'name' => $permission['name'],
                'slug' => $permission['slug'],
            ]);
        }
    }
}
