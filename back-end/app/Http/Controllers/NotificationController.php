<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        return response($user->notifications, 200);
    }
    public function markAsRead(Request $request)
    {
        $user = auth()->user();
        $notification = $user->notifications->markAsRead();
        return response(status: 204);
    }
    public function delete(Request $request, string $notification)
    {
        if (!$notification) {
            return response(['message' => 'Notification ID is required'], 422);
        }
        $user = auth()->user();
        $notification = $user->notifications()->find($notification);
        if ($notification) {
            $notification->delete();
            return response(status: 204);
        }
        return response(['message' => 'Notification not found'], 404);
    }
}
