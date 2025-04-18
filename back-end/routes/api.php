<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventCategoryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';
Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('/users', [UserController::class, 'update']);
    Route::apiResource('eventCategories', EventCategoryController::class);
    Route::apiResource('events', EventController::class);
    Route::get('/analytics/line-graph', [AnalyticsController::class, 'lineGraph']);
    Route::get('/analytics/pie-chart', [AnalyticsController::class, 'pieChart']);
    Route::get('/analytics/bar-chart', [AnalyticsController::class, 'barChart']);
});
