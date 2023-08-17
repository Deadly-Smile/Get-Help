<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class PostsController extends Controller
{
    public function store(Request $request)
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('create-post')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        $post = new Post([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
        ]);

        $post->save();
        // it hase many-to-many relation after next migration i want to make it one to many
        $user->posts()->attach($post);
        // JWTAuth::user()->posts()->save($post);
        return response()->json(['message' => "Post successfully created"], 200);
    }

    public function showAllPost()
    {
        $posts = Post::where('isPending', false)->get();
        foreach ($posts as $post) {
            $users = $post->users;
            foreach ($users as $user) {
                $post->author = $user->username;
                break;
            }
        }
        return response()->json(['posts' => $posts], 200);
    }
}
