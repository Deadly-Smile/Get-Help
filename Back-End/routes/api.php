<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\PostsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// healthCheck
Route::get('/health', function () {
    return response()->json(['message' => 'API is working correctly.'], 200);
});

Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::get('user/{id}', [UserController::class, 'getTheUser']);
Route::resource('/users', UserController::class);

Route::middleware('custom.token.validation')->group(function () {
    Route::get('/user', [UserController::class, 'getUser']);
    Route::post("/edit-user", [UserController::class, 'editUser']);
    Route::post('/apply-admin', [UserController::class, 'applyForAdmin']);
});

Route::get('users', [UserController::class, 'getAllUsers']);
Route::get('roles', [UserController::class, 'getAllRoles']);
Route::get('permissions', [UserController::class, 'getAllPermissions']);
Route::get('permission-role', [UserController::class, 'getAllPermissionRoles']);

Route::middleware('auth:api')->group(function () {
    Route::get('get-contacts', [UserController::class, 'getAllContacts']);
    // Route::get('/user', [UserController::class, 'getUser']);
    Route::get('/get-users', [UserController::class, 'getPagedUsers']);
    Route::delete('/delete-user/{id}', [UserController::class, 'deleteUser']);
    Route::get('/get-doctors', [UserController::class, 'getPagedDoctors']);
    Route::get('/get-admins', [UserController::class, 'getPagedAdmins']);
    Route::post('/approve-admin/{id}', [UserController::class, 'approveAdmin']);
    Route::post('/disprove-admin/{id}', [UserController::class, 'disproveAdmin']);
    Route::post('/approve-doctor/{id}', [UserController::class, 'approveDoctor']);
    Route::post('/disprove-doctor/{id}', [UserController::class, 'disproveDoctor']);
    Route::post('/add-post', [PostsController::class, 'store']);
    Route::post('/vote/post/{id}', [PostsController::class, 'vote']);
    Route::post('/add/comment/post/{id}', [PostsController::class, 'addComment']);
    Route::get('/messages/{receiver}/{sender}', [UserController::class, 'getMessages']);
    Route::post('/message-send', [UserController::class, 'sendMessage']);
    Route::post('/pusher/auth', [UserController::class, 'authenticatePusher']);
    Route::post('/message/update/status', [UserController::class, 'updateMsgStat']);
    Route::post('/notification/seen', [UserController::class, 'updateNoti']);
    Route::get('/get-pending-posts', [PostsController::class, 'getPendingPosts']);
    Route::get('/delete-post/{id}', [PostsController::class, 'deletePost']);
    Route::get('/approve-post/{id}', [PostsController::class, 'approvePost']);
});
Route::put('/{id}/signup/verify', [UserController::class, 'signUpVerify']);
Route::get('/posts', [PostsController::class, 'showAllPost']);
Route::get('/post/{id}', [PostsController::class, 'getFullPost']);
Route::get('username:{username}', [UserController::class, 'getUsersByUsername']);
