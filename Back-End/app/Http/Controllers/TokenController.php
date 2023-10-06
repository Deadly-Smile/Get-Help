<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class TokenController extends Controller
{
    public function getRechargeToken()
    {
        $user = JWTAuth::user();
        $perPage = 20;
        if ($user->userHasPermission('create-delete-recharge-token')) {
            $tokens = Token::paginate($perPage);
            foreach ($tokens as $token) {
                $token->creator = User::findOrFail($token->creator_id)->username;
                if ($token->handler_id) {
                    $token->handler = (User::findOrFail($token->handler_id)) ? (User::findOrFail($token->handler_id)->username) : "None";
                }
                if ($token->used_user_id) {
                    $token->used_user = (User::findOrFail($token->used_user_id)) ? (User::findOrFail($token->used_user_id)->username) : "None";
                }
            }
            return response()->json([
                'items' => $tokens,
            ]);
        } else if ($user->userHasPermission('make-available-recharge-token')) {
            $tokens = Token::where('handler_id', $user->id)->orderByDesc('id')->paginate($perPage);
            foreach ($tokens as $token) {
                $token->creator = User::findOrFail($token->creator_id)->username;
                $token->handler = (User::findOrFail($token->handler_id)) ? (User::findOrFail($token->handler_id)->username) : "None";
                $token->used_user = (User::findOrFail($token->used_user_id)) ? (User::findOrFail($token->used_user_id)->username) : "None";
            }
            return response()->json([
                'items' => $tokens,
            ]);
        } else {
            return response()->json(['error' => 'permission not granted'], 401);
        }
    }

    public function createToken(Request $request)
    {
        $user = JWTAuth::user();
        if ($user->userHasPermission('create-delete-recharge-token')) {
            $handler = null;
            if ($request->input('handler_id')) {
                $handlerUser = User::findOrFail((int)$request->input('handler_id'));
                if ($handlerUser->userHasRole('admin') || $handlerUser->userHasRole('master')) {
                    $handler = (int)$request->input('handler_id');
                }
            }
            $token = new Token();
            $token->creator_id = $user->id;
            $token->token = random_int(100000000, 999999999);
            $token->handler_id = $handler;
            $token->is_used = $request->input('is_used', false);
            $token->used_user_id = $request->input('used_user_id', null);
            $token->value = $request->input('value');
            $token->save();
            return response()->json([
                'message' => 'Token created successfully',
                'token' => $token,
            ], 201);
        } else {
            return response()->json(['error' => 'permission not granted'], 401);
        }
    }

    public function deleteToken($id)
    {
        $user = JWTAuth::user();
        // dd("inside");
        if ($user->userHasPermission('create-delete-recharge-token')) {
            // dd("inside");
            $token = Token::findOrFail($id);
            if (!$token->delete()) {
                return response()->json(["message" => "Failed to delete"]);
            }
            return response()->json(["message" => "Successfully deleted"]);
        } else if ($user->userHasPermission('make-available-recharge-token')) {
            $token = Token::findOrFail($id);
            if ($token->is_used) {
                if (!$token->delete()) {
                    return response()->json(["message" => "Failed to delete"]);
                }
                return response()->json(["message" => "Successfully deleted"]);
            } else {
                return response()->json(['error' => 'permission not granted'], 401);
            }
        } else {
            return response()->json(['error' => 'permission not granted'], 401);
        }
    }

    public function assignAdmin($id, Request $request)
    {
        $user = JWTAuth::user();
        if ($user->userHasPermission('create-delete-recharge-token')) {
            $token = Token::findOrFail($id);
            $admin = User::where('username', $request->input('username'))->get()->last();
            if ($admin && $admin->userHasRole('admin')) {
                if (!$token->is_used && $admin->id) {
                    $token->handler_id = $admin->id;
                    $token->save();
                    return response()->json(["message" => "Successfully assigned a admin"], 200);
                } else {
                    return response()->json(["message" => "Error occuered"], 400);
                }
            } else {
                return response()->json(["message" => "Error occuered"], 400);
            }
        } else {
            return response()->json(['error' => 'permission not granted'], 401);
        }
    }

    public function useToken(Request $request)
    {
        $user = JWTAuth::user();
        if ($user->userHasPermission('use-recharge-token')) {
            $token = Token::where('token', $request->input('token'))->get()->last();
            if (!$token->is_used && $token->handler_id) {
                $user->balance += (int)$token->value;
                $token->is_used = true;
                $token->used_user_id = $user->id;
                $token->save();
                $user->save();
                return response()->json(["message" => "Successfully recharged"], 200);
            }
        } else {
            return response()->json(['error' => 'permission not granted'], 401);
        }
    }

    public function transferMoney($id, Request $request)
    {
        $user = JWTAuth::user();
        if ($user->userHasPermission('use-recharge-token')) {
            if ($user->balance >= $request->input('amount')) {
                $receiver = User::findOrFail($id);
                if ($receiver) {
                    $receiver->balance += $request->input('amount');
                    $user->balance -= $request->input('amount');
                    $receiver->save();
                    $user->save();
                } else {
                    return response()->json(['error' => 'Unexpected error occured'], 400);
                }
            } else {
                return response()->json(['error' => 'Insufficient fund'], 400);
            }
        } else {
            return response()->json(['error' => 'permission not granted'], 401);
        }
    }
}
