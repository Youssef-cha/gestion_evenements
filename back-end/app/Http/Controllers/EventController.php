<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $events = $user->events()->get();
        return response($events, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request)
    {
        $user = auth()->user();
        $event = $user->events()->create($request->validated());
        $event->load('category');
        return response($event, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        if ($event->user_id !== auth()->user()->id) {
            return response(['message' => 'Unauthorized'], 403);
        }
        return response($event, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        if ($event->user_id !== auth()->user()->id) {
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
        if ($event->user_id !== auth()->user()->id) {
            return response(['message' => 'Unauthorized'], 403);
        }
        $event->delete();
        return response(status: 204);
    }
}
