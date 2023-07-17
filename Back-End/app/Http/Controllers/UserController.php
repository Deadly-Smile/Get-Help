<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignUpRequest;
use App\Jobs\SendUserVarifyMail;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::get();
        $sendingUser = array();
        foreach ($users as $user) {
            array_push($sendingUser, ["id" => $user->id, "name" => $user->name, "username" => $user->username, "email" => $user->email]);
        }
        return response()->json($sendingUser);
    }

    public function store(SignUpRequest $request)
    {
        $newUser = new User();
        $newUser->username = $request["username"];
        $newUser->name = $request["name"];
        $newUser->email = $request["email"];
        $newUser->password = bcrypt($request["password"]);
        $mailData = [
            "name" => $newUser->name,
            "link" => "http://localhost:5173/",
            "sixDigitNumber" => random_int(100000, 999999),
        ];
        dispatch(new SendUserVarifyMail(["send-to" => $newUser->email, "data" => $mailData]));
        // if ($newUser->save()) {
        //     $user = User::latest()->first();
        //     return response()->json(["data" => ["id" => $user->id, "name" => $user->name, "username" => $user->username, "email" => $user->email], "message" => "User registered successfully, to varify the mail please check your email"]);
        // }
        // return response()->json(["message" => "Failed to register the user"]);
    }
}
