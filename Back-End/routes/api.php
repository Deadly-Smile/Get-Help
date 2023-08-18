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

Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
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
});
Route::put('/{id}/signup/verify', [UserController::class, 'signUpVerify']);
Route::resource('/users', UserController::class);
Route::post("/edit-user", [UserController::class, 'editUser']);
Route::post('/apply-admin', [UserController::class, 'applyForAdmin']);
Route::get('/posts', [PostsController::class, 'showAllPost']);
