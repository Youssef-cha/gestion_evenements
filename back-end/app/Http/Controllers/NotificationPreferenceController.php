<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventNotificationPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationPreferenceController extends Controller
{
    public function store(Request $request, Event $event)
    {
        $data = $request->validate([
            'minutes_before' => 'required|integer|min:0',
            'email_notification' => 'required|boolean',
            'in_app_notification' => 'required|boolean',
        ]);

        $preference = EventNotificationPreference::updateOrCreate(
            [
                'event_id' => $event->id,
                'user_id' => Auth::id(),
            ],
            $data
        );

        return response()->json($preference);
    }

    public function show(Event $event)
    {
        $preference = EventNotificationPreference::where('event_id', $event->id)
            ->where('user_id', Auth::id())
            ->first();

        return response()->json($preference);
    }

    public function getNotifications()
    {
        $notifications = Auth::user()
            ->notifications()
            ->paginate(10);

        return response()->json($notifications);
    }

    public function markAsRead(string $notificationId)
    {
        $notification = Auth::user()
            ->notifications()
            ->where('id', $notificationId)
            ->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json(['success' => true]);
    }
}