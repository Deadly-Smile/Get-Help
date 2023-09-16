<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckJWTSession
{
    public function handle($request, Closure $next)
    {
        // Attempt to authenticate the user using the JWT token
        $user = JWTAuth::user();

        if ($user) {
            // Update the user's last activity timestamp
            $user->last_activity = now();
            $user->save();
        }

        return $next($request);
    }
}
