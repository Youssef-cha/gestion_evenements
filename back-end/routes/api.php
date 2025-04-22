<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventCategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventAttendeeController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\NotificationPreferenceController;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';

Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('/users', [UserController::class, 'update']);
    Route::apiResource('eventCategories', EventCategoryController::class);
    Route::apiResource('events', EventController::class)->except(['show']);
    Route::get('/analytics/line-graph', [AnalyticsController::class, 'lineGraph']);
    Route::get('/analytics/pie-chart', [AnalyticsController::class, 'pieChart']);
    Route::get('/analytics/bar-chart', [AnalyticsController::class, 'barChart']);

    // Event attendee routes
    Route::get('/search-users', [EventAttendeeController::class, 'searchUsers']);
    Route::post('/events/{event}/invite', [EventAttendeeController::class, 'invite']);
    Route::put('/events/{event}/attendance', [EventAttendeeController::class, 'updateStatus']);
    Route::get('/events/{event}/attendees', [EventAttendeeController::class, 'getEventAttendees']);

    // Team routes
    Route::apiResource('teams', TeamController::class)->except(['show']);
    Route::post('teams/{team}/members', [TeamController::class, 'addMembers']);
    Route::delete('teams/{team}/members', [TeamController::class, 'removeMembers']);
    Route::put('teams/{team}/favorite', [TeamController::class, 'toggleFavorite']);
});

// Notification routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationPreferenceController::class, 'getNotifications']);
    Route::post('/notifications/{notification}/read', [NotificationPreferenceController::class, 'markAsRead']);
    Route::post('/events/{event}/notification-preferences', [NotificationPreferenceController::class, 'store']);
    Route::get('/events/{event}/notification-preferences', [NotificationPreferenceController::class, 'show']);
});
