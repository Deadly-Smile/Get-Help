<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\TokenController;
use Illuminate\Support\Facades\Route;
use TheSeer\Tokenizer\TokenCollection;

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

Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::get('user/{id}', [UserController::class, 'getTheUser']);
Route::middleware('auth:api')->group(function () {
    Route::get('/user', [UserController::class, 'getUser']);
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
    Route::get('/get-contacts', [UserController::class, 'getContacts']);
    Route::get('/messages/{receiver}/{sender}', [UserController::class, 'getMessages']);
    Route::post('/message-send', [UserController::class, 'sendMessage']);
    Route::post('/pusher/auth', [UserController::class, 'authenticatePusher']);
    Route::post('/message/update/status', [UserController::class, 'updateMsgStat']);
    Route::post('/notification/seen', [UserController::class, 'updateNoti']);
    Route::get('/get-recharge-token', [TokenController::class, 'getRechargeToken']);
    Route::post('/create/recharge-token', [TokenController::class, 'createToken']);
    Route::get('/delete-recharge-token/{id}', [TokenController::class, 'deleteToken']);
    Route::post('/assign-recharge-token/{id}', [TokenController::class, 'assignAdmin']);
    Route::post('/use-recharge-token', [TokenController::class, 'useToken']);
    Route::post('/donate/to_{id}', [TokenController::class, 'transferMoney']);
});
Route::put('/{id}/signup/verify', [UserController::class, 'signUpVerify']);
Route::resource('/users', UserController::class);
Route::post("/edit-user", [UserController::class, 'editUser']);
Route::post('/apply-admin', [UserController::class, 'applyForAdmin']);
Route::get('/posts', [PostsController::class, 'showAllPost']);
Route::get('/post/{id}', [PostsController::class, 'getFullPost']);
Route::get('username:{username}', [UserController::class, 'getUsersByUsername']);
