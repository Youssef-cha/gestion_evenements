<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventCategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventAttendeeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\NotificationPreferenceController;
use App\Notifications\EventInvitationNotification;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';

Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('/users', [UserController::class, 'update']);
    // event categories routes
    Route::apiResource('eventCategories', EventCategoryController::class);

    // Event routes
    Route::apiResource('events', EventController::class)->except(['show']);

    // Analytics routes
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

    Route::get('/send', function () {
        $user = auth()->user();
        $user->notify(new EventInvitationNotification($user->events()->first(), $user));
        return response()->json(['message' => 'Notification sent']);
    });

    Route::get('/notifications', [NotificationController::class, 'index']);

    Route::post('/notifications/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'delete']);
});
