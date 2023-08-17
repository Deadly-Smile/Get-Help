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
        JWTAuth::user()->posts()->attach(Post::latest()->first());
        // JWTAuth::user()->posts()->save($post);
        return response()->json(['message' => "Post successfully created"], 200);
    }

    public function showAllPost()
    {
        $posts = Post::where('isPending', false)->get();
        foreach ($posts as $post) {
            $post->author = $post->user->username;
        }
        return response()->json(['posts' => $posts], 200);
    }
}
