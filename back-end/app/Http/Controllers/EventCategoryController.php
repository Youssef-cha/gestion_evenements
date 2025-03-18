<?php

namespace App\Http\Controllers;

use App\Models\EventCategory;
use App\Http\Requests\StoreEventCategoryRequest;
use App\Http\Requests\UpdateEventCategoryRequest;

class EventCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return EventCategory::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventCategoryRequest $request)
    {
        $eventCategory = EventCategory::create($request->validated());
        return $eventCategory;
    }

    /**
     * Display the specified resource.
     */
    public function show(EventCategory $eventCategory)
    {
        return $eventCategory;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventCategoryRequest $request, EventCategory $eventCategory)
    {
        $eventCategory->update($request->validated());
        return $eventCategory;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EventCategory $eventCategory)
    {
        $eventCategory->delete();
        return response(204);
    }
}
