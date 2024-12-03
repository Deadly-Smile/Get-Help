<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::find(1);
        $user->posts()->saveMany(Post::factory(5)->make());
        $user = User::find(2);
        $user->posts()->saveMany(Post::factory(3)->make());
    }
}
