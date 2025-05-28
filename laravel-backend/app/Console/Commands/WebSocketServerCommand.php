<?php

namespace App\Console\Commands;

use App\Services\WebSocketServer;
use Illuminate\Console\Command;

class WebSocketServerCommand extends Command
{
    protected $signature = 'websocket:serve {--port=8080}';
    protected $description = 'Start the WebSocket server for real-time updates';

    public function handle()
    {
        $port = $this->option('port');
        
        $this->info("Starting WebSocket server on port {$port}...");
        
        try {
            WebSocketServer::start($port);
        } catch (\Exception $e) {
            $this->error("Failed to start WebSocket server: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}