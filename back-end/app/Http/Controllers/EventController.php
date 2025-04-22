<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Get events created by the user
        $createdEvents = $user->events()
            ->with(['attendees', 'category'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get events where user is an accepted attendee
        $invitedEvents = Event::whereHas('attendees', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->where('status', 'accepted');
        })
            ->with(['attendees', 'category'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Merge both collections and sort by created_at
        $allEvents = $createdEvents->concat($invitedEvents)
            ->sortByDesc('created_at')
            ->values();

        return response($allEvents, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request)
    {
        $user = Auth::user();
        $event = $user->events()->create($request->validated());
        $event->load('category');
        return response($event, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        if ($event->user_id !== Auth::id()) {
            return response(['message' => 'Unauthorized'], 403);
        }
        $event->update($request->validated());
        return response($event, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        if ($event->user_id !== Auth::id()) {
            return response(['message' => 'Unauthorized'], 403);
        }
        $event->delete();
        return response(status: 204);
    }
}
