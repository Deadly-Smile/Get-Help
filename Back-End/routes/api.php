<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
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
});
Route::put('/{id}/signup/verify', [UserController::class, 'signUpVerify']);
Route::resource('/users', UserController::class);
Route::post("/edit-user", [UserController::class, 'editUser']);
Route::post('/apply-admin', [UserController::class, 'applyForAdmin']);
