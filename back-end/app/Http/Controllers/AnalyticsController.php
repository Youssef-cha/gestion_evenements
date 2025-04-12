<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{

    public function index()
    {
        $events = Event::selectRaw('YEAR(start_time) as year, MONTHNAME(start_time) as month, COUNT(*) as events')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->get();

        return response()->json($events);
    }
}
