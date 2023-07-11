<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::get();
        $sendingUser = array();
        foreach ($users as $user) {
            array_push($sendingUser, ["id" => $user->id, "name" => $user->name, "email" => $user->email]);
        }
        return response()->json($sendingUser);
    }

    public function store(Request $request)
    {
        $validatedUser = $request->validate([
            "name" => ["required", "max:255"],
            "email" => ["required", "unique:users", "email"],
            "password" => ["min:4", "confirmed"],
            "password_confirmation" => ["required", "min:4"]
        ]);
        $newUser = new User();
        $newUser->name = $validatedUser["name"];
        $newUser->email = $validatedUser["email"];
        $newUser->password = bcrypt($validatedUser["password"]);
        if ($newUser->save()) {
            $user = User::latest()->first();
            return response()->json(["data" => ["id" => $user->id, "name" => $user->name, "email" => $user->email], "message" => "User registered successfully"]);
        }
        return response()->json(["message" => "Failed to register the user"]);
    }
}
