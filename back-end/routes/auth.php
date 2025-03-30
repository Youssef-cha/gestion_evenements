<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
// authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware(['auth:sanctum', 'validIp']);
Route::post('/user', [AuthController::class, 'user'])->middleware(['auth:sanctum', 'validIp']);

// email verification routes
Route::post('/email/verification-notification', [AuthController::class, 'resendEmail'])->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware(['auth:sanctum', 'signed'])->name('verification.verify');

// password reset routes
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('guest:sanctum')->name('password.email');
Route::get('/reset-password/{token}', [AuthController::class, 'passwordReset'])->middleware('guest:sanctum')->name('password.reset');
Route::post('/reset-password', [AuthController::class, 'passwordResetUpdate'])->middleware('guest:sanctum')->name('password.update');
