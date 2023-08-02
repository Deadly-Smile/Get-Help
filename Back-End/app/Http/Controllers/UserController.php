<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use App\Jobs\SendUserVarifyMail;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Requests\SignUpRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\EditUserRequest;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Contracts\Providers\Storage as JWTStorage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SignUpRequest $request)
    {
        // Validate the user input
        // already validated

        // mail data
        $mailData = [
            "name" => $request["name"],
            "link" => "http://localhost:5173/",
            "sixDigitNumber" => random_int(100000, 999999),
        ];

        // Create a new user with the validated data
        $user = User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'password' => Hash::make($request['password']),
            'username' => $request['username'],
            'verify_token' => $mailData['sixDigitNumber']
        ]);

        // send mail
        dispatch(new SendUserVarifyMail(["send-to" => $user->email, "data" => $mailData]));

        // get leatest user id
        $user = User::latest()->first();

        // Optionally, you can log in the user after registration
        // auth()->login($user);
        return response()->json(["data" => ["id" => $user->id, "name" => $user->name, "username" => $user->username, "email" => $user->email], "message" => "User registered successfully, to varify the mail please check your email"]);
    }

    /**
     * Verify user 
     */
    public function signUpVerify(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            if ($user->verify_token == $request['code']) {
                $user->verify_token = null;
                $user->email_verified_at = now();
                $user->roles()->attach(Role::where('slug', 'subscriber')->firstOrFail());
                $user->save();
                return response()->json(['message' => "Email verified"]);
            }
            return response()->json(['message' => "Could not verify email, please try again"], 400);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Log in
     */

    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Get the authenticated user
            $user = JWTAuth::user();
            if ($user->verify_token) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            return response()->json(['token' => $token], 200);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Could not create token'], 500);
        }
    }


    public function logout(Request $request)
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Successfully logged out', "id" => $request['message']]);
    }

    public function editUser(EditUserRequest $request)
    {
        $avatar = $request->file('avatar');
        $document = $request->file('document');
        $avatarUrl = null;
        $documentUrl = null;
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            $path = $avatar->store('public/pictures');
            $avatarUrl = Storage::url($path);
        }
        if ($request->hasFile('document') && $request->file('document')->isValid()) {
            $path = $document->store('public/documents');
            $documentUrl = Storage::url($path);
        }
        $user = Auth::user();

        $user->name = $request->input('name');
        $user->date_of_birth = $request->input('date_of_birth');

        if ($request->has('new_password')) {
            if ($request->filled('old_password')) {
                if (!Hash::check($request->input('old_password'), $user->password)) {
                    return response()->json(['message' => 'Invalid old password'], 422);
                }
                $user->password = Hash::make($request->input('new_password'));
            }
        }

        if ($request->input('is_a_doctor')) {
            $user->nid_card_number = $request->input('nid_card_number');
            $user->mobile = $request->input('mobile');
            $user->country = $request->input('country');
            $user->district = $request->input('district');
            $user->address = $request->input('address');
            $user->document = $documentUrl;
        }

        $user->avatar = $avatarUrl;
        $user->save();
        return response()->json(['message' => 'User information updated successfully']);
    }
}
