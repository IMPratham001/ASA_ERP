
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TimeEntry;

class TimeTrackingController extends Controller
{
    public function store(Request $request)
    {
        $timeEntry = TimeEntry::create($request->all());
        return response()->json($timeEntry, 201);
    }

    public function getStaffEntries($staffId)
    {
        $entries = TimeEntry::where('staff_id', $staffId)->get();
        return response()->json($entries);
    }
}
