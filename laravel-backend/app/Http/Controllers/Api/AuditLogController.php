<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuditLogController extends Controller
{
    /**
     * Store an audit log entry.
     */
    public function store(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'event_type' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'details' => 'required|string',
        ]);

        // For now, just log it to Laravel log file (storage/logs/laravel.log)
        Log::info('Audit Log:', $validated);

        // You can later extend this to save to DB or external service

        return response()->json([
            'message' => 'Audit log saved successfully',
            'data' => $validated,
        ], 201);
    }
}
