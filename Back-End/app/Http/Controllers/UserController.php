<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Jobs\SendUserVarifyMail;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Requests\SignUpRequest;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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
        //
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
        } catch (JWTException $e) {
            return response()->json(['message' => 'Could not create token'], 500);
        }

        return response()->json(['token' => $token], 200);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Successfully logged out']);
    }

    // public function test(Request $request)
    // {
    //     $request = $request->only('name', 'date_of_birth', "picture");
    //     return response()->json(['request' => $request], 200);
    // }

    public function test(Request $request)
    {
        // Get the uploaded file named "picture"
        $picture = $request->file('picture');

        // Log the received file data to help debug
        Log::info('Received picture data:', ['file' => $picture]);

        // Ensure that the file was uploaded successfully
        if ($request->hasFile('picture') && $request->file('picture')->isValid()) {
            // Move the file to the desired storage location (e.g., public directory)
            $path = $picture->store('public/pictures');

            // Log the file storage path for debugging
            Log::info('Stored file path:', ['path' => $path]);

            // Get the URL to access the file
            $url = Storage::url($path);

            // Return the URL in the response
            return response()->json(['message' => 'File uploaded successfully', 'picture_url' => $url], 200);
        } else {
            // Handle the case when the file was not uploaded correctly
            return response()->json(['error' => 'File upload failed'], 400);
        }
    }
}
