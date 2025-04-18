<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{

    public function lineGraph()
    {
        $lineData = Event::selectRaw('YEAR(start_time) as year, MONTHNAME(start_time) as month, COUNT(*) as events')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->get();

        return response()->json($lineData);
    }
    public function pieChart()
    {
        $pieData = Event::join('event_categories', 'events.event_category_id', '=', 'event_categories.id')
            ->selectRaw('event_categories.name as category,YEAR(start_time) as year, COUNT(events.id) as number_of_events')
            ->without('category')
            ->groupBy('event_categories.name', 'year')
            ->get();

        return response()->json($pieData);
    }
}
