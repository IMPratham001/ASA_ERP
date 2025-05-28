<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SystemController extends Controller
{
    /**
     * Get system status information
     */
    public function status()
    {
        // Check if there's a cached system status
        $cachedStatus = Cache::get('system_status');
        
        if ($cachedStatus) {
            return response()->json($cachedStatus);
        }
        
        // Default system status
        $systemStatus = [
            'status' => 'operational',
            'message' => 'All systems are operational',
            'last_updated' => now()->toISOString(),
            'services' => [
                'api' => [
                    'status' => 'operational',
                    'uptime' => $this->getUptime()
                ],
                'database' => [
                    'status' => 'operational',
                    'response_time' => 'normal'
                ],
                'authentication' => [
                    'status' => 'operational',
                    'response_time' => 'normal'
                ]
            ],
            'maintenance' => [
                'scheduled' => false,
                'next_window' => null,
                'message' => null
            ]
        ];
        
        // Cache for 5 minutes
        Cache::put('system_status', $systemStatus, 300);
        
        return response()->json($systemStatus);
    }
    
    /**
     * Update system status (for admin use)
     */
    public function updateStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|in:operational,maintenance,degraded,outage',
            'message' => 'required|string|max:255',
            'services' => 'sometimes|array',
            'maintenance' => 'sometimes|array'
        ]);
        
        $systemStatus = [
            'status' => $request->status,
            'message' => $request->message,
            'last_updated' => now()->toISOString(),
            'services' => $request->get('services', [
                'api' => ['status' => $request->status],
                'database' => ['status' => $request->status],
                'authentication' => ['status' => $request->status]
            ]),
            'maintenance' => $request->get('maintenance', [
                'scheduled' => false,
                'next_window' => null,
                'message' => null
            ])
        ];
        
        // Cache for 5 minutes
        Cache::put('system_status', $systemStatus, 300);
        
        return response()->json($systemStatus);
    }
    
    /**
     * Get server uptime (simplified)
     */
    private function getUptime()
    {
        if (function_exists('sys_getloadavg') && PHP_OS_FAMILY !== 'Windows') {
            // On Unix-like systems
            $uptime = shell_exec('uptime');
            if ($uptime) {
                return trim($uptime);
            }
        }
        
        // Fallback - return application uptime since last deployment
        $deploymentFile = base_path('.deployment_time');
        if (file_exists($deploymentFile)) {
            $deploymentTime = (int) file_get_contents($deploymentFile);
            $uptimeSeconds = time() - $deploymentTime;
            return $this->formatUptime($uptimeSeconds);
        }
        
        return 'Application running normally';
    }
    
    /**
     * Format uptime in human readable format
     */
    private function formatUptime($seconds)
    {
        $days = floor($seconds / 86400);
        $hours = floor(($seconds % 86400) / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        
        $parts = [];
        if ($days > 0) $parts[] = $days . ' day' . ($days != 1 ? 's' : '');
        if ($hours > 0) $parts[] = $hours . ' hour' . ($hours != 1 ? 's' : '');
        if ($minutes > 0) $parts[] = $minutes . ' minute' . ($minutes != 1 ? 's' : '');
        
        return implode(', ', $parts) ?: 'Less than a minute';
    }
}