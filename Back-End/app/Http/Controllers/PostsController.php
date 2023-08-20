<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Vote;
use App\Models\Comment;
use App\Models\User;
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
        $perPage = (int)request()->input('perPage', 10);
        $posts = Post::query()->where('isPending', false)->orderByDesc('id')->paginate($perPage);
        foreach ($posts as $post) {
            $users = $post->users;
            foreach ($users as $user) {
                $post->author = $user->username;
                break;
            }
            $post->comments = $this->commentOfPost($post->id);
            $post->downvote_count = $post->downvotes()->count();
            $post->upvote_count = $post->upvotes()->count();
        }
        return response()->json(['posts' => $posts], 200);
    }

    public function vote(Request $request, $id)
    {
        $user = JWTAuth::user();
        if (!$user->userHasPermission('vote-post')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }
        $vote = 0;
        if ($request->input('type') === 'upvote') {
            $vote = 1; // 1 for upvote
        } else {
            $vote = -1; // -1 for downvote
        }
        if (!$user->hasVoted(Post::findOrFail($id))) {

            $vote = new Vote([
                'user_id' => $user->id,
                'post_id' => $id,
                'vote' => $vote,
            ]);

            $vote->save();

            return response()->json(['message' => 'Voted successfully'], 200);
        } else {
            $existingVote = $user->votes()->where('post_id', $id)->first();
            if ($existingVote) {
                $existingVote->update([
                    'vote' => $vote,
                ]);
                return response()->json(['message' => 'Vote toggled successfully'], 200);
            }
        }
        return response()->json(['error' => 'Something went very wrong'], 400);
    }

    private function commentOfPost($id)
    {
        $post = Post::find($id);
        $comments = $post->comments;
        foreach ($comments as $comment) {
            $comment->author = User::findOrFail($comment->user_id)->username;
        }
        return $comments;
    }

    public function getComments($id)
    {
        return response()->json(['comments' => $this->commentOfPost($id)], 200);
    }

    public function addComment(Request $request, $id)
    {
        $user = JWTAuth::user();
        if (!$user->userHasPermission('comment-post')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        $comment = new Comment([
            'content' => $request->input('content'),
            'post_id' => $id,
            'user_id' => $user->id,
        ]);
        $comment->save();

        return response()->json(['message' => 'Successfully commented'], 200);
    }
}
