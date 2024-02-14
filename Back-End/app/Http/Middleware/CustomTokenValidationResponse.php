<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class CustomTokenValidationResponse
{
    public function handle($request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            // Token is valid, continue with the request
            return $next($request);
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token has expired'], 200);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Invalid token'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Token is not provided'], 400);
        }
    }
}
