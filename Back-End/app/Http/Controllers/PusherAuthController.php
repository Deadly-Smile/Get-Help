<?php

namespace App\Http\Controllers;

use Pusher\Pusher;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;

class PusherAuthController extends Controller
{
    public function authenticate(Request $request)
    {
        $socket_id = $request->socket_id;
        $channel_name = $request->channel_name;
        $user = JWTAuth::user();

        // Your authentication logic goes here
        // Check if the authenticated user can access this channel

        // For simplicity, let's assume anyone can access any private channel
        $auth = Pusher::presence_auth($channel_name, $socket_id, $user->id);

        return response($auth);
    }
}
