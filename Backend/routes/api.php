<?php

use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::post('/register', [UserController::class, 'register']);
Route::delete('/users/{user}', [UserController::class, 'delete']);
Route::put('/users/{id}', [UserController::class, 'update']);
