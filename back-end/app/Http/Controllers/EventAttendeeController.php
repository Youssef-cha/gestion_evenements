<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use App\Models\EventAttendee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventAttendeeController extends Controller
{
    public function searchUsers(Request $request)
    {
        $query = $request->validate([
            'search' => 'required|string|min:2'
        ]);

        $users = User::where('name', 'like', "%{$query['search']}%")
            ->orWhere('email', 'like', "%{$query['search']}%")
            ->limit(10)
            ->get(['id', 'name', 'email', 'avatar']);

        return response()->json($users);
    }

    public function invite(Request $request, Event $event)
    {
        // Check if user is the event owner
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        // Check if user is already invited
        $existing = EventAttendee::where('event_id', $event->id)
            ->where('user_id', $data['user_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'User already invited'], 422);
        }

        $attendee = EventAttendee::create([
            'event_id' => $event->id,
            'user_id' => $data['user_id'],
            'status' => 'pending'
        ]);

        return response()->json($attendee, 201);
    }

    public function updateStatus(Request $request, Event $event)
    {
        $data = $request->validate([
            'status' => 'required|in:accepted,declined'
        ]);

        $attendee = EventAttendee::where('event_id', $event->id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $attendee->update(['status' => $data['status']]);

        return response()->json($attendee);
    }

    public function getEventAttendees(Event $event)
    {
        $attendees = $event->attendees()
            ->with(['user:id,name,email,avatar'])
            ->get();

        return response()->json($attendees);
    }
}
