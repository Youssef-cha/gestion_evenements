<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventCategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// event category routes
Route::apiResource('eventCategory', EventCategoryController::class);
