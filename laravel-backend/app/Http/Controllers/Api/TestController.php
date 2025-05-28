<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Exception;

class TestController extends Controller
{
    /**
     * Health check endpoint - Critical for frontend monitoring
     * This endpoint should always be fast and reliable
     */
    public function health(): JsonResponse
    {
        try {
            $startTime = microtime(true);
            
            // Basic health checks
            $checks = [
                'api' => true,
                'timestamp' => now()->toISOString(),
                'uptime' => $this->getUptime(),
            ];

            // Optional: Quick database connectivity check (comment out if causing issues)
            try {
                DB::connection()->getPdo();
                $checks['database'] = true;
            } catch (Exception $e) {
                $checks['database'] = false;
                Log::warning('Database health check failed: ' . $e->getMessage());
            }

            $responseTime = round((microtime(true) - $startTime) * 1000, 2);
            $checks['response_time_ms'] = $responseTime;

            return response()->json([
                'status' => 'ok',
                'service' => 'asa-erp-api',
                'version' => '1.0.0',
                'environment' => app()->environment(),
                'checks' => $checks
            ]);

        } catch (Exception $e) {
            Log::error('Health check failed: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'service' => 'asa-erp-api',
                'message' => 'Service temporarily unavailable',
                'timestamp' => now()->toISOString()
            ], 503);
        }
    }

    /**
     * System status endpoint for login page
     */
    public function systemStatus(): JsonResponse
    {
        try {
            // Check various system components
            $status = $this->performSystemChecks();
            
            return response()->json([
                'status' => $status['overall_status'],
                'message' => $status['message'],
                'details' => $status['details'],
                'last_updated' => now()->toISOString(),
                'maintenance_mode' => app()->isDownForMaintenance()
            ]);

        } catch (Exception $e) {
            Log::error('System status check failed: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'warning',
                'message' => 'Unable to verify all system components',
                'last_updated' => now()->toISOString()
            ]);
        }
    }

    /**
     * Audit logging endpoint for login attempts
     */
    public function auditLog(Request $request): JsonResponse
    {
        try {
            // Validate the audit log data
            $validated = $request->validate([
                'event_type' => 'required|string|max:100',
                'username' => 'nullable|string|max:255',
                'ip_address' => 'nullable|string|max:45',
                'details' => 'nullable|string|max:1000',
                'timestamp' => 'nullable|string'
            ]);

            // Get actual IP address
            $ipAddress = $request->ip();
            
            // Log the audit event
            Log::info('Audit Event', [
                'event_type' => $validated['event_type'],
                'username' => $validated['username'] ?? 'anonymous',
                'ip_address' => $ipAddress,
                'user_agent' => $request->userAgent(),
                'details' => $validated['details'] ?? '',
                'timestamp' => $validated['timestamp'] ?? now()->toISOString(),
                'session_id' => $request->session()->getId(),
            ]);

            // Optional: Store in database if you have an audit_logs table
            // AuditLog::create([...]);

            return response()->json([
                'success' => true,
                'message' => 'Audit log recorded',
                'timestamp' => now()->toISOString()
            ]);

        } catch (Exception $e) {
            Log::error('Audit logging failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Audit logging failed'
            ], 500);
        }
    }

    /**
     * API status endpoint for authenticated users
     */
    public function apiStatus(): JsonResponse
    {
        try {
            $status = [
                'api_version' => '1.0.0',
                'laravel_version' => app()->version(),
                'php_version' => PHP_VERSION,
                'environment' => app()->environment(),
                'debug_mode' => config('app.debug'),
                'timezone' => config('app.timezone'),
                'database' => $this->getDatabaseStatus(),
                'cache' => $this->getCacheStatus(),
                'queue' => $this->getQueueStatus(),
                'storage' => $this->getStorageStatus(),
                'memory_usage' => $this->getMemoryUsage(),
                'timestamp' => now()->toISOString()
            ];

            return response()->json([
                'success' => true,
                'data' => $status
            ]);

        } catch (Exception $e) {
            Log::error('API status check failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Status check failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Database connectivity test
     */
    public function databaseTest(): JsonResponse
    {
        try {
            $startTime = microtime(true);
            
            // Test database connection
            $pdo = DB::connection()->getPdo();
            $dbVersion = $pdo->getAttribute(\PDO::ATTR_SERVER_VERSION);
            
            // Test a simple query
            $result = DB::select('SELECT 1 as test');
            
            $responseTime = round((microtime(true) - $startTime) * 1000, 2);

            return response()->json([
                'success' => true,
                'database' => [
                    'connected' => true,
                    'version' => $dbVersion,
                    'driver' => config('database.default'),
                    'response_time_ms' => $responseTime,
                    'test_query' => $result[0]->test === 1
                ],
                'timestamp' => now()->toISOString()
            ]);

        } catch (Exception $e) {
            Log::error('Database test failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'database' => [
                    'connected' => false,
                    'error' => config('app.debug') ? $e->getMessage() : 'Connection failed'
                ],
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    /**
     * Get system uptime (approximate)
     */
    private function getUptime(): string
    {
        if (function_exists('sys_getloadavg')) {
            $uptime = sys_getloadavg();
            return 'Load: ' . implode(', ', array_map(fn($load) => round($load, 2), $uptime));
        }
        
        return 'Unknown';
    }

    /**
     * Perform comprehensive system checks
     */
    private function performSystemChecks(): array
    {
        $checks = [];
        $overallStatus = 'operational';
        $message = 'All systems operational';

        // Database check
        try {
            DB::connection()->getPdo();
            $checks['database'] = 'operational';
        } catch (Exception $e) {
            $checks['database'] = 'error';
            $overallStatus = 'error';
            $message = 'Database connectivity issues detected';
        }

        // Cache check
        try {
            Cache::put('system_check', 'ok', 60);
            $checks['cache'] = Cache::get('system_check') === 'ok' ? 'operational' : 'warning';
        } catch (Exception $e) {
            $checks['cache'] = 'warning';
            if ($overallStatus === 'operational') {
                $overallStatus = 'warning';
                $message = 'Cache system issues detected';
            }
        }

        // Storage check
        try {
            $checks['storage'] = is_writable(storage_path()) ? 'operational' : 'warning';
        } catch (Exception $e) {
            $checks['storage'] = 'warning';
        }

        // Memory check
        $memoryLimit = ini_get('memory_limit');
        $memoryUsage = memory_get_usage(true);
        $checks['memory'] = [
            'limit' => $memoryLimit,
            'used' => $this->formatBytes($memoryUsage),
            'status' => 'operational'
        ];

        return [
            'overall_status' => $overallStatus,
            'message' => $message,
            'details' => $checks
        ];
    }

    /**
     * Get database connection status
     */
    private function getDatabaseStatus(): array
    {
        try {
            $pdo = DB::connection()->getPdo();
            return [
                'connected' => true,
                'driver' => config('database.default'),
                'version' => $pdo->getAttribute(\PDO::ATTR_SERVER_VERSION)
            ];
        } catch (Exception $e) {
            return [
                'connected' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get cache system status
     */
    private function getCacheStatus(): array
    {
        try {
            $key = 'cache_test_' . time();
            Cache::put($key, 'test', 10);
            $working = Cache::get($key) === 'test';
            Cache::forget($key);
            
            return [
                'working' => $working,
                'driver' => config('cache.default')
            ];
        } catch (Exception $e) {
            return [
                'working' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get queue system status
     */
    private function getQueueStatus(): array
    {
        return [
            'driver' => config('queue.default'),
            'connection' => config('queue.connections.' . config('queue.default'))
        ];
    }

    /**
     * Get storage system status
     */
    private function getStorageStatus(): array
    {
        return [
            'disk' => config('filesystems.default'),
            'writable' => is_writable(storage_path()),
            'free_space' => $this->formatBytes(disk_free_space(storage_path()))
        ];
    }

    /**
     * Get memory usage information
     */
    private function getMemoryUsage(): array
    {
        return [
            'current' => $this->formatBytes(memory_get_usage(true)),
            'peak' => $this->formatBytes(memory_get_peak_usage(true)),
            'limit' => ini_get('memory_limit')
        ];
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}