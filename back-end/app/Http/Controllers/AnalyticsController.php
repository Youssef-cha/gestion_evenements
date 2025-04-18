<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{

    public function lineGraph()
    {
        $userId = auth()->id();

        $lineData = Event::where('user_id', $userId)
            ->selectRaw('YEAR(start_time) as year, MONTHNAME(start_time) as month, COUNT(*) as events')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->get();

        return response()->json($lineData);
    }

    public function pieChart()
    {
        $userId = auth()->id();

        $pieData = Event::join('event_categories', 'events.event_category_id', '=', 'event_categories.id')
            ->where('events.user_id', $userId)
            ->selectRaw('event_categories.name as category,YEAR(start_time) as year, COUNT(events.id) as number_of_events')
            ->without('category')
            ->groupBy('event_categories.name', 'year')
            ->get();

        return response()->json($pieData);
    }

    public function barChart()
    {
        $userId = auth()->id();

        $barData = Event::join('event_categories', 'events.event_category_id', '=', 'event_categories.id')
            ->where('events.user_id', $userId)
            ->selectRaw('event_categories.name as category,YEAR(start_time) as year, COUNT(events.id) as number_of_events')
            ->groupBy('event_categories.name', 'year')
            ->without('category')
            ->orderBy('year', 'desc')
            ->orderBy('number_of_events', 'desc')
            ->get();

        return response()->json($barData);
    }
}
