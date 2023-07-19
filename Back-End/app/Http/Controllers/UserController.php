<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Jobs\SendUserVarifyMail;
use App\Http\Requests\SignUpRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Passport;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::get();
        $sendingUser = array();
        foreach ($users as $user) {
            $sendingUser[] = ["id" => $user->id, "name" => $user->name, "username" => $user->username, "email" => $user->email];
        }
        return response()->json($sendingUser);
    }

    /**
     * @throws Exception
     */
    public function store(SignUpRequest $request): JsonResponse
    {
        $mailData = [
            "name" => $request["name"],
            "link" => "http://localhost:5173/",
            "sixDigitNumber" => random_int(100000, 999999),
        ];
        $newUser = new User();
        $newUser->username = $request["username"];
        $newUser->name = $request["name"];
        $newUser->email = $request["email"];
        $newUser->password = bcrypt($request["password"]);
        $newUser->verify_token = $mailData["sixDigitNumber"];

        dispatch(new SendUserVarifyMail(["send-to" => $newUser->email, "data" => $mailData]));
        if ($newUser->save()) {
            $user = User::latest()->first();
            return response()->json(["data" => ["id" => $user->id, "name" => $user->name, "username" => $user->username, "email" => $user->email], "message" => "User registered successfully, to varify the mail please check your email"]);
        }
        return response()->json(["message" => "Failed to register the user"]);
    }

    public function signUpVerify(Request $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            if ($user->verify_token == $request['code']) {
                $user->verify_token = null;
                $user->email_verified_at = now();
                $user->save();
                return response()->json(['message' => "Email verified"]);
            }
            return response()->json(['message' => "Could not verify email, please try again"], 400);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('username', 'password');
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if ($user->email_verified_at != null) {
                $token = $user->createToken('Access Token')->accessToken;
                $updatedUser = User::findOrFail($user->id);
                $updatedUser->remember_token = $token;
                $updatedUser->save();
                return response()->json(['message' => "Logged in successfully", "token" => $token], 200);
            }
        }
        return response()->json(['message' => "Wrong credentials.."], 400);
    }
}
