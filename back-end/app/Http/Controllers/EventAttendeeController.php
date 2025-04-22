<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Team;
use App\Models\User;
use App\Models\EventAttendee;
use App\Notifications\EventInvitationNotification;
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
            ->limit(5)
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
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
            'team_ids' => 'array',
            'team_ids.*' => 'exists:teams,id'
        ]);
        $userIds = $data['user_ids'] ?? [];
        $teamUserIds = [];

        // If teams are selected, add all team members
        if (isset($data['team_ids'])) {
            $teams = Team::whereIn('id', $data['team_ids'])->with('members')->get();
            foreach ($teams as $team) {
                $teamUserIds = array_merge($teamUserIds, $team->members->pluck('id')->toArray());
            }
        }

        // Merge and remove duplicates
        $allUserIds = array_unique(array_merge($userIds, $teamUserIds));

        // Create attendee records and send notifications
        foreach ($allUserIds as $userId) {
            // Skip if already an attendee
            if (!$event->attendees()->where('user_id', $userId)->exists()) {
                $event->attendees()->attach($userId, ['status' => 'pending']);

                // Send notification
                $user = User::find($userId);
                $user->notify(new EventInvitationNotification($event));
            }
        }

        return response()->json($event->load('attendees'));
    }

    public function updateStatus(Request $request, Event $event)
    {
        $data = $request->validate([
            'status' => 'required|in:accepted,declined'
        ]);

        $event->attendees()->updateExistingPivot(Auth::id(), [
            'status' => $data['status']
        ]);

        return response()->json($event->load('attendees.user'));
    }

    public function getEventAttendees(Event $event)
    {
        return response()->json($event->load('attendees'));
    }
}
