<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Vote;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Http;

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

        // $isPassable = $this->filterContent($request->input('content'));
        // API verification expaired
        $isPassable = false;

        $post->isPending = !$isPassable;
        // $post->isPending = true;
        $post->save();

        $user->posts()->attach($post);
        if (!$isPassable) {
            return response()->json(['message' => 'Pending for an Admin approval'], 200);
        }
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
                $post->author_avatar = $user->avatar;
                break;
            }
            $post->comments = $this->commentOfPost($post->id);
            foreach ($post->comments as $comment) {
                $comment->author_avatar = User::findOrFail($comment->user_id)->avatar;
            }
            $post->downvote_count = $post->downvotes()->count();
            $post->upvote_count = $post->upvotes()->count();
        }
        return response()->json(['posts' => $posts], 200);
    }

    /**
     * Scope to improve performance
     */
    public function getPendingPosts()
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('approve_or_delete_posts')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        $perPage = (int)request()->input('perPage', 10);
        $posts = Post::query()->where('isPending', true)->orderByDesc('id')->paginate($perPage);
        foreach ($posts as $post) {
            $users = $post->users;
            foreach ($users as $user) {
                $post->author = $user->username;
                $post->author_avatar = $user->avatar;
                break;
            }
            $post->comments = $this->commentOfPost($post->id);
            foreach ($post->comments as $comment) {
                $comment->author_avatar = User::findOrFail($comment->user_id)->avatar;
            }
            $post->downvote_count = $post->downvotes()->count();
            $post->upvote_count = $post->upvotes()->count();
        }
        return response()->json(['items' => $posts], 200);
    }

    public function deletePost($id)
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('approve_or_delete_posts')) {
            return response()->json(['message' => 'permission not granted'], 401);
        }
        $post = Post::findOrFail($id);
        if ($post->isPending) {
            if (!$post->delete()) {
                return response()->json(["message" => "Failed to delete", 'id' => $id]);
            }
            return response()->json(["message" => "Successfully deleted", 'id' => $id]);
        } else {
            return response()->json(['message' => 'permission not granted'], 401);
        }
    }

    public function approvePost($id)
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('approve_or_delete_posts ')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        $post = Post::findOrFail($id);
        if ($post->isPending) {
            $post->isPending = false;
            $post->save();
            return response()->json(["message" => "Successfully approved", 'id' => $id]);
        } else {
            return response()->json(['error' => 'Already approved'], 401);
        }
    }

    public function getFullPost($id)
    {
        $post = Post::findOrFail($id);
        $post->comments = $this->commentOfPost($post->id);
        $post->downvote_count = $post->downvotes()->count();
        $post->upvote_count = $post->upvotes()->count();
        $users = $post->users;
        foreach ($users as $user) {
            $post->author = $user->username;
            break;
        }

        return response()->json(['post' => $post], 200);
    }

    public function getPostOfUser($id)
    {
        $user = User::findOrFail($id);
        $perPage = (int)request()->input('perPage', 10);
        $posts = $user->posts()->orderByDesc('id')->paginate($perPage);
        foreach ($posts as $post) {
            $post->comments = $this->commentOfPost($post->id);
            $post->downvote_count = $post->downvotes()->count();
            $post->upvote_count = $post->upvotes()->count();
            $post->author = $user->username;
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



    private function filterContent($content)
    {
        // Get the text to filter from the request
        $htmlToFilter = $content;

        // Extract plain text from HTML content
        $plainTextToFilter = $this->extractPlainText($htmlToFilter);
        // Make the API call to OpenAI Content Filter. Do not have cradit to call this api need money
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
        ])->post('https://api.openai.com/v1/moderations', [
            'input' => $plainTextToFilter
        ]);
        // $apiKey = env('FILTER_API_KEY'); // Replace with your Perspective API key

        // $response = Http::post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze', [
        //     'comment' => ['text' => $plainTextToFilter],
        //     'requestedAttributes' => ['TOXICITY' => []],
        // ], [
        //     'query' => ['key' => $apiKey],
        // ]);

        $data = $response->json();
        // dd($data);
        $categoryScores = $response['results'][0]['category_scores'];

        // Threshold score for passing
        $threshold = 0.5;

        // Check if all category scores are less than the threshold
        $isPassable = true;

        // $resData = array([]);
        foreach ($categoryScores as $category) {
            // array_push($resData, ['Score' => $category]);
            if ($category >= $threshold) {
                $isPassable = false;
                break;
            }
        }
        // dd($data, $resData, $isPassable);

        return $isPassable;

        // if (isset($data['attributeScores']['TOXICITY']['summaryScore']['value'])) {
        //     $toxicityScore = $data['attributeScores']['TOXICITY']['summaryScore']['value'];
        //     if ($toxicityScore !== null && $toxicityScore > 0.5) {
        //         return false;
        //     } else {
        //         return true;
        //         // Content is not toxic, proceed
        //     }
        // } else {
        //     return true;
        // }
    }

    private function extractPlainText($html)
    {
        // Remove HTML tags and their content, keeping only the text
        $plainText = strip_tags($html);

        // Decode HTML entities to get the actual characters
        $plainText = htmlspecialchars_decode($plainText);

        // Remove extra whitespaces and newlines
        $plainText = preg_replace('/\s+/', ' ', $plainText);
        $plainText = trim($plainText);

        return $plainText;
    }
}
