<?php

namespace App\Http\Controllers;

use Exception;
use Pusher\Pusher;
use App\Models\Role;
use App\Models\User;
use App\Models\Contact;
use App\Models\Message;
use App\Events\MessageSent;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Jobs\SendUserVarifyMail;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Events\MessageStatusUpdated;
use App\Http\Requests\SignUpRequest;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\EditUserRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\ApplyAdminRequest;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends Controller
{
    public function getUser(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['error' => 'Invalid username or password'], 400);
        }
        $permission = $request->user()->getAllPermissions();
        $msgN = Notification::where('receiver_user_id', $request->user()->id)->where('type', 'message')->orderByDesc('id')->take(20)->get();
        $otrN = Notification::where('receiver_user_id', $request->user()->id)->where('type', 'notification')->orderByDesc('id')->take(20)->get();
        $notifications = $otrN->concat($msgN)->sortBy('timestamp')->values();
        foreach ($notifications as $notification) {
            $notification->triggered_username = User::findOrFail($notification->triggered_user_id)->username;
            $notification->triggered_user_avatar = User::findOrFail($notification->triggered_user_id)->avatar;
        }
        return response()->json(['user' => $request->user(), 'permission' => $permission, 'notifications' => $notifications]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SignUpRequest $request)
    {
        // mail data
        $randomNum = random_int(100000, 999999);

        // Create a new user with the validated data
        $user = User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'password' => Hash::make($request['password']),
            'username' => $request['username'],
            'verify_token' => $randomNum,
            'pending_subscriber' => true,
        ]);

        // get leatest user id
        $user = User::latest()->first();
        $mailData = [
            "name" => $request["name"],
            "link" => "http://localhost:5173/verify-user/" . $user->id,
            "sixDigitNumber" => $randomNum,
        ];

        // send mail
        dispatch(new SendUserVarifyMail(["send-to" => $user->email, "data" => $mailData]));

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
                $user->pending_subscriber = false;
                $user->email_verified_at = now();

                // $user->roles()->attach(Role::where('slug', 'subscriber')->firstOrFail()->id);
                DB::table('role_user')->insert(['user_id' => $user->id, 'role_id' => Role::where('slug', 'subscriber')->firstOrFail()->id]);
                $user->save();
                return response()->json(['message' => "Email verified"]);
            }
            return response()->json(['message' => "Could not verify email, please try again"], 400);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
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
            if ($user->pending_subscriber) {
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
        $user = JWTAuth::user();

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
            $user->pending_doctor = true;
        }

        $user->avatar = $avatarUrl;
        $user->save();
        return response()->json(['message' => 'User information updated successfully']);
    }

    public function applyForAdmin(ApplyAdminRequest $request)
    {
        $user = JWTAuth::user();
        if ($user->pending_subscriber) {
            return response()->json(['message' => 'invalid user can not apply for admin role', 404]);
        }

        $document = $request->file('document');
        $documentUrl = null;
        if ($request->hasFile('document') && $request->file('document')->isValid()) {
            $path = $document->store('public/documents');
            $documentUrl = Storage::url($path);
        }

        $user->pending_admin = true;
        $user->nid_card_number = $request->input('nid_card_number');
        $user->mobile = $request->input('mobile');
        $user->country = $request->input('country');
        $user->district = $request->input('district');
        $user->address = $request->input('address');
        $user->document = $documentUrl;

        $user->save();
        return response()->json(['message' => "Your request is being proccessed"], 200);
    }


    public function getPagedUsers()
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('edit-user-table')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        // sending the sorted users
        $roleName = ['admin', 'master', 'doctor'];
        $perPage = (int)request()->input('perPage', 10);
        $users = User::query()->where(function ($query) use ($roleName) {
            $query->whereHas('roles', function ($query) use ($roleName) {
                $query->whereNotIn('slug', $roleName);
            });
        })
            ->orderByDesc('id')->paginate($perPage);
        return response()->json(['items' => $users, 'perPage' => $perPage], 200);
    }

    public function deleteUser($id)
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('edit-user-table')) {
            return response()->json(['error' => 'permission not granted', 'id' => $id], 401);
        }

        // delete user
        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(["message" => "404 user not found", 'id' => $id]);
        }
        if (!$user->delete()) {
            return response()->json(["message" => "Failed to delete", 'id' => $id]);
        }
        return response()->json(["message" => "Successfully deleted", 'id' => $id]);
    }

    public function getPagedDoctors()
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('edit-doctor-table')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }
        // sending the sorted users
        $perPage = (int)request()->input('perPage', 10);
        $users = User::query()
            ->where('pending_doctor', true)
            ->orWhere(function ($query) {
                $query->whereHas('roles', function ($query) {
                    $query->where('slug', 'doctor');
                });
            })
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json(['items' => $users], 200);
    }

    public function getPagedAdmins()
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('edit-admin-table')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        // sending the sorted users
        $roleName = ['admin', 'master'];
        $perPage = (int)request()->input('perPage', 10);
        $users = User::query()->where(function ($query) use ($roleName) {
            $query->whereHas('roles', function ($query) use ($roleName) {
                $query->whereIn('slug', $roleName);
            });
        })
            ->orWhere('pending_admin', true)
            ->orderByDesc('id')->paginate($perPage);
        return response()->json(['items' => $users], 200);
    }

    public function approveAdmin($id)
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('edit-admin-table')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(["message" => "404 user not found", 'id' => $id]);
        }
        // DB::table('role_user')->delete(['user_id' => $user->id, 'role_id' => Role::where('slug', 'subscriber')->firstOrFail()->id]);
        $user->roles()->detach(Role::findOrFail(1));
        if (!$user->userHasRole(Role::findOrFail(3)->slug)) {
            $user->roles()->attach(Role::findOrFail(3));
        }
        $user->pending_admin = false;
        $user->save();
        return response()->json(['message' => 'Successfully approved user ' . $id . ' as an admin'], 200);
    }

    public function approveDoctor($id)
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('edit-doctor-table')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(["message" => "404 user not found", 'id' => $id]);
        }
        $user->roles()->detach(Role::findOrFail(1));
        if (!$user->userHasRole(Role::findOrFail(2)->slug)) {
            $user->roles()->attach(Role::findOrFail(2));
        }
        $user->pending_doctor = false;
        $user->save();
        return response()->json(['message' => 'Successfully approved user ' . $id . ' as a doctor'], 200);
    }

    public function disproveAdmin($id)
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('edit-admin-table')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(["message" => "404 user not found", 'id' => $id]);
        }
        $user->roles()->detach(Role::findOrFail(3));
        if (!$user->userHasRole(Role::findOrFail(1)->slug)) {
            $user->roles()->attach(Role::findOrFail(1));
        }
        $user->pending_admin = false;
        $user->save();
        return response()->json(['message' => 'Successfully disproved user ' . $id . ' as an admin'], 200);
    }

    public function disproveDoctor($id)
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('edit-doctor-table')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(["message" => "404 user not found", 'id' => $id]);
        }
        $user->roles()->detach(Role::findOrFail(2));
        if (!$user->userHasRole(Role::findOrFail(1)->slug)) {
            $user->roles()->attach(Role::findOrFail(1));
        }
        $user->pending_doctor = false;
        $user->save();
        return response()->json(['message' => 'Successfully disproved user ' . $id . ' as a doctor'], 200);
    }

    public function getAllUsers()
    {
        $users = User::all();
        foreach ($users as $user) {
            $user->role = $user->roles();
        }
        return $users;
    }

    public function getAllPermissions()
    {
        return Permission::all();
    }

    public function getAllPermissionRoles()
    {
        $roles = Role::all();
        foreach ($roles as $role) {
            $role->permission = array($role->permissions());
        }
        return $roles;
    }

    public function getAllContacts()
    {
        return Contact::all();
    }

    public function getTheUser($id)
    {
        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(["message" => "404 user not found", 'id' => $id], 404);
        }

        $posts = $user->posts;
        $totalUpvotes = 0;
        $totalDownvotes = 0;
        foreach ($posts as $post) {
            $totalUpvotes += $post->upvotes()->count();
            $totalDownvotes += $post->downvotes()->count();
        }

        $sendingUser = array(
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'country' => $user->country,
            'district' => $user->district,
            'posts' => $posts,
            'status' => $user->getStatusAttribute(),
            'contribution' => (int)$totalUpvotes - $totalDownvotes,
            'isAdmin' => $user->userHasRole(Role::findOrFail(3)->slug) ? true : false,
            'isDoctor' => $user->userHasRole(Role::findOrFail(2)->slug) ? true : false,
            'isMaster' => $user->userHasRole(Role::findOrFail(4)->slug) ? true : false
        );

        return response()->json(['user' => $sendingUser], 200);
    }

    public function getContacts()
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('get-contacts')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }
        $contacts = Contact::where('user_1', $user->id)
            ->orWhere('user_2', $user->id)->distinct()
            ->get();


        foreach ($contacts as $contact) {
            $contact->userID = $contact->user_1 == $user->id ? $contact->user_2 : $contact->user_1;
            $contact->avatar = User::findOrFail($contact->userID)->avatar;
            $contact->status = User::findOrFail($contact->userID)->status;
            $contact->name = User::findOrFail($contact->userID)->name;
            $contact->category = User::findOrFail($contact->userID)->roles()[0]->name;
        }

        return response()->json(['contacts' => $contacts], 200);
    }

    public function getUsersByUsername($username)
    {
        $users = User::where('username', 'like', '%' . $username . '%')->get();
        $sendingUsers = array();
        foreach ($users as $user) {
            if ($user->pending_subscriber == 1) {
                continue;
            }
            $tempUser = array(
                'id' => $user->id,
                'username' => $user->username,
                'avatar' => $user->avatar,
                'status' => $user->getStatusAttribute(),
                'isAdmin' => $user->userHasRole(Role::findOrFail(3)->slug) ? true : false,
                'isDoctor' => $user->userHasRole(Role::findOrFail(2)->slug) ? true : false,
                'isMaster' => $user->userHasRole(Role::findOrFail(4)->slug) ? true : false
            );
            array_push($sendingUsers, $tempUser);
        }
        return response()->json(['users' => $sendingUsers], 200);
    }

    public function getMessages($receiver, $sender)
    {
        $user = JWTAuth::user();
        if (!$user->userHasPermission('get-messages') || $user->id != $sender) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        $sentMessages = Message::where('sender_id', $user->id)
            ->where('receiver_id', $receiver)
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'type' => $message->type,
                    'senderName' => $message->sender_username,
                    'senderId' => $message->sender_id,
                    'status' => $message->read,
                    'message' => $message->content,
                    'timestamp' => $message->created_at,
                    'roomID' => $message->room_id,
                ];
            });

        $receivedMessages = Message::where('sender_id', $receiver)
            ->where('receiver_id', $user->id)
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'type' => $message->type,
                    'senderName' => $message->sender_username,
                    'senderId' => $message->sender_id,
                    'status' => $message->read,
                    'message' => $message->content,
                    'timestamp' => $message->created_at,
                    'roomID' => $message->room_id,
                ];
            });

        $allMessages = $sentMessages->concat($receivedMessages)->sortBy('timestamp')->values();

        return response()->json(['messages' => $allMessages], 200);
    }


    public function sendMessage(Request $request)
    {
        $user = JWTAuth::user();
        if (!$user->userHasPermission('send-message')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        $users = array($user->id, $request['receiver']);
        sort($users);
        if ($users[0] != $users[1]) {
            Contact::updateOrCreate(
                ['user_1' => $users[0], 'user_2' => $users[1]],
                ['updated_at' => now()]
            );
        }

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $request['receiver'],
            'content' => $request["content"] ?? null,
            'type' => $request["type"] ? $request["type"] : 'text',
            'room_id' => $request["roomID"] ?? null,
            'sender_username' => $user->username,
            'receiver_username' => User::findOrFail($request['receiver'])->username
        ]);

        $notification = Notification::create([
            'type' => $request["type"],
            'is_read' => 0,
            'content' => $request["content"],
            'triggered_user_id' => $user->id,
            'receiver_user_id' => (int)$request['receiver'],
            'room_id' => $request["roomID"]
        ]);

        $notification->triggered_username = $user->username;
        $notification->triggered_user_avatar = $user->avatar;

        broadcast(new MessageSent($user->id, $message))->toOthers();
        $pusher = new Pusher(env('PUSHER_APP_KEY'), env('PUSHER_APP_SECRET'), env('PUSHER_APP_ID'));
        $pusher->trigger('notifications.' . $request['receiver'], 'new-message', ["notification" => $notification, 'roomID' => $request["roomID"]]);

        return response()->json(['message' => "message sent successfully", 'sent' => $message], 201);
    }


    public function authenticatePusher(Request $request)
    {
        $socket_id = $request->socket_id;
        $channel_name = $request->channel_name;
        $user = JWTAuth::user();

        $pusher = new Pusher(
            config('broadcasting.connections.pusher.key'),
            config('broadcasting.connections.pusher.secret'),
            config('broadcasting.connections.pusher.app_id'),
            [
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
                'encrypted' => config('broadcasting.connections.pusher.options.encrypted'),
            ]
        );

        $auth = $pusher->presence_auth($channel_name, $socket_id, $user->id);

        return response($auth);
    }

    public function updateMsgStat(Request $request)
    {
        // check the user
        $user = JWTAuth::user();
        if (!$user->userHasPermission('send-message')) {
            return response()->json(['error' => 'permission not granted'], 401);
        }

        Message::where('receiver_id', $user->id)
            ->where('sender_id', $request['senderId'])
            ->update(['read' => true]);

        broadcast(new MessageStatusUpdated($request['messageId'], $request['senderId'], $user->id))->toOthers();
        // broadcast(new MessageStatusUpdated($request['messageId'], $request['senderId'], $user->id))->toOthers();

        return response()->json(['message' => "Successfully updated status"], 200);
    }

    public function updateNoti(Request $request)
    {
        $user = JWTAuth::user();
        if ($user) {
            $noti = Notification::findOrFail($request['noti_id']);
            $noti->is_read = true;
            $noti->save();
            return response()->json(['message' => "Successfully updated the notification"], 200);
        } else {
            return response()->json(['error' => 'permission not granted'], 401);
        }
    }
}
