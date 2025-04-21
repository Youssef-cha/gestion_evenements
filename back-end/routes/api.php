<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventCategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventAttendeeController;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';

Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('/users', [UserController::class, 'update']);
    Route::apiResource('eventCategories', EventCategoryController::class);
    Route::apiResource('events', EventController::class);
    Route::get('/analytics/line-graph', [AnalyticsController::class, 'lineGraph']);
    Route::get('/analytics/pie-chart', [AnalyticsController::class, 'pieChart']);
    Route::get('/analytics/bar-chart', [AnalyticsController::class, 'barChart']);

    // Event attendee routes
    Route::get('/search-users', [EventAttendeeController::class, 'searchUsers']);
    Route::post('/events/{event}/invite', [EventAttendeeController::class, 'invite']);
    Route::put('/events/{event}/attendance', [EventAttendeeController::class, 'updateStatus']);
    Route::get('/events/{event}/attendees', [EventAttendeeController::class, 'getEventAttendees']);
});
