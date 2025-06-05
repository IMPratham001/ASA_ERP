<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Exception;

class AuditController extends Controller
{
    /**
     * Basic health check endpoint
     */
    public function health()
    {
        $startTime = microtime(true);
        $checks = [];
        $overallStatus = 'healthy';
        
        try {
            // Database Check
            $dbCheck = $this->checkDatabase();
            $checks['database'] = $dbCheck;
            
            // Cache Check
            $cacheCheck = $this->checkCache();
            $checks['cache'] = $cacheCheck;
            
            // Storage Check
            $storageCheck = $this->checkStorage();
            $checks['storage'] = $storageCheck;
            
            // Application Check
            $appCheck = $this->checkApplication();
            $checks['application'] = $appCheck;
            
            // Determine overall status
            foreach ($checks as $check) {
                if ($check['status'] === 'error') {
                    $overallStatus = 'unhealthy';
                    break;
                } elseif ($check['status'] === 'warning' && $overallStatus !== 'unhealthy') {
                    $overallStatus = 'degraded';
                }
            }
            
        } catch (Exception $e) {
            $overallStatus = 'unhealthy';
            $checks['error'] = [
                'status' => 'error',
                'message' => 'Health check failed: ' . $e->getMessage(),
                'timestamp' => now()->toISOString()
            ];
        }
        
        $responseTime = round((microtime(true) - $startTime) * 1000, 2);
        
        return response()->json([
            'status' => $overallStatus,
            'timestamp' => now()->toISOString(),
            'response_time_ms' => $responseTime,
            'checks' => $checks,
            'version' => config('app.version', '1.0.0'),
            'environment' => app()->environment()
        ], $overallStatus === 'unhealthy' ? 503 : 200);
    }
    
    /**
     * Simple ping endpoint
     */
    public function ping()
    {
        return response()->json([
            'message' => 'pong',
            'timestamp' => now()->toISOString(),
            'server_time' => now()->format('Y-m-d H:i:s T')
        ]);
    }
    
    /**
     * Check database connectivity
     */
    private function checkDatabase()
    {
        try {
            $startTime = microtime(true);
            DB::connection()->getPdo();
            $responseTime = round((microtime(true) - $startTime) * 1000, 2);
            
            // Test a simple query
            $result = DB::select('SELECT 1 as test');
            
            return [
                'status' => 'healthy',
                'message' => 'Database connection successful',
                'response_time_ms' => $responseTime,
                'connection' => config('database.default'),
                'timestamp' => now()->toISOString()
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Database connection failed: ' . $e->getMessage(),
                'timestamp' => now()->toISOString()
            ];
        }
    }
    
    /**
     * Check cache functionality
     */
    private function checkCache()
    {
        try {
            $startTime = microtime(true);
            $testKey = 'health_check_' . time();
            $testValue = 'test_value';
            
            // Test cache write
            Cache::put($testKey, $testValue, 60);
            
            // Test cache read
            $retrievedValue = Cache::get($testKey);
            
            // Clean up
            Cache::forget($testKey);
            
            $responseTime = round((microtime(true) - $startTime) * 1000, 2);
            
            if ($retrievedValue === $testValue) {
                return [
                    'status' => 'healthy',
                    'message' => 'Cache is working properly',
                    'response_time_ms' => $responseTime,
                    'driver' => config('cache.default'),
                    'timestamp' => now()->toISOString()
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Cache read/write test failed',
                    'timestamp' => now()->toISOString()
                ];
            }
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Cache check failed: ' . $e->getMessage(),
                'timestamp' => now()->toISOString()
            ];
        }
    }
    
    /**
     * Check storage accessibility
     */
    private function checkStorage()
    {
        try {
            $startTime = microtime(true);
            $storagePath = storage_path('logs');
            
            if (!is_writable($storagePath)) {
                return [
                    'status' => 'error',
                    'message' => 'Storage directory is not writable',
                    'path' => $storagePath,
                    'timestamp' => now()->toISOString()
                ];
            }
            
            $responseTime = round((microtime(true) - $startTime) * 1000, 2);
            
            return [
                'status' => 'healthy',
                'message' => 'Storage is accessible',
                'response_time_ms' => $responseTime,
                'disk_space' => $this->getFreeDiskSpace(),
                'timestamp' => now()->toISOString()
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Storage check failed: ' . $e->getMessage(),
                'timestamp' => now()->toISOString()
            ];
        }
    }
    
    /**
     * Check application status
     */
    private function checkApplication()
    {
        try {
            $status = 'healthy';
            $messages = [];
            
            // Check if app is in debug mode in production
            if (app()->environment('production') && config('app.debug')) {
                $status = 'warning';
                $messages[] = 'Debug mode is enabled in production';
            }
            
            // Check if APP_KEY is set
            if (!config('app.key')) {
                $status = 'error';
                $messages[] = 'Application key is not set';
            }
            
            // Memory usage check
            $memoryUsage = memory_get_usage(true);
            $memoryLimit = $this->convertToBytes(ini_get('memory_limit'));
            $memoryPercentage = ($memoryUsage / $memoryLimit) * 100;
            
            if ($memoryPercentage > 90) {
                $status = 'warning';
                $messages[] = 'High memory usage: ' . round($memoryPercentage, 2) . '%';
            }
            
            return [
                'status' => $status,
                'message' => $status === 'healthy' ? 'Application is running normally' : implode(', ', $messages),
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'memory_usage' => [
                    'current' => $this->formatBytes($memoryUsage),
                    'limit' => ini_get('memory_limit'),
                    'percentage' => round($memoryPercentage, 2)
                ],
                'timestamp' => now()->toISOString()
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Application check failed: ' . $e->getMessage(),
                'timestamp' => now()->toISOString()
            ];
        }
    }
    
    /**
     * Get free disk space
     */
    private function getFreeDiskSpace()
    {
        $bytes = disk_free_space(storage_path());
        return $this->formatBytes($bytes);
    }
    
    /**
     * Convert memory limit string to bytes
     */
    private function convertToBytes($value)
    {
        $value = trim($value);
        $last = strtolower($value[strlen($value) - 1]);
        $value = (int) $value;
        
        switch ($last) {
            case 'g':
                $value *= 1024;
            case 'm':
                $value *= 1024;
            case 'k':
                $value *= 1024;
        }
        
        return $value;
    }
    
    /**
     * Format bytes to human readable format
     */
    private function formatBytes($size, $precision = 2)
    {
        $base = log($size, 1024);
        $suffixes = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        return round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
    }
}