<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventCategoryController;
use Illuminate\Support\Facades\Route;

// authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware(['auth:sanctum', 'validIp']);
Route::post('/user', [AuthController::class, 'user'])->middleware(['auth:sanctum', 'validIp']);

// event category routes
Route::apiResource('eventCategories', EventCategoryController::class);


Route::post('/email/verification-notification', [AuthController::class, 'resendEmail'])->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware(['auth:sanctum', 'signed'])->name('verification.verify');
