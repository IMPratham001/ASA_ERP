
<?php

namespace App\Services;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use SplObjectStorage;

class WebSocketServer implements MessageComponentInterface
{
    protected $clients;
    protected $rooms;

    public function __construct()
    {
        $this->clients = new SplObjectStorage();
        $this->rooms = [];
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
        
        // Send welcome message
        $conn->send(json_encode([
            'type' => 'connection',
            'message' => 'Connected to ASA ERP WebSocket server',
            'connection_id' => $conn->resourceId
        ]));
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg, true);
        
        if (!$data || !isset($data['type'])) {
            return;
        }

        switch ($data['type']) {
            case 'join_room':
                $this->joinRoom($from, $data['room'] ?? 'general');
                break;
                
            case 'leave_room':
                $this->leaveRoom($from, $data['room'] ?? 'general');
                break;
                
            case 'broadcast':
                $this->broadcast($data, $data['room'] ?? 'general', $from);
                break;
                
            case 'ping':
                $from->send(json_encode(['type' => 'pong', 'timestamp' => time()]));
                break;
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        
        // Remove from all rooms
        foreach ($this->rooms as $room => $connections) {
            if (isset($connections[$conn->resourceId])) {
                unset($this->rooms[$room][$conn->resourceId]);
            }
        }
        
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    protected function joinRoom(ConnectionInterface $conn, string $room)
    {
        if (!isset($this->rooms[$room])) {
            $this->rooms[$room] = [];
        }
        
        $this->rooms[$room][$conn->resourceId] = $conn;
        
        $conn->send(json_encode([
            'type' => 'room_joined',
            'room' => $room,
            'message' => "Joined room: {$room}"
        ]));
        
        echo "Connection {$conn->resourceId} joined room: {$room}\n";
    }

    protected function leaveRoom(ConnectionInterface $conn, string $room)
    {
        if (isset($this->rooms[$room][$conn->resourceId])) {
            unset($this->rooms[$room][$conn->resourceId]);
            
            $conn->send(json_encode([
                'type' => 'room_left',
                'room' => $room,
                'message' => "Left room: {$room}"
            ]));
        }
    }

    protected function broadcast(array $data, string $room, ConnectionInterface $sender = null)
    {
        if (!isset($this->rooms[$room])) {
            return;
        }

        $message = json_encode([
            'type' => 'broadcast',
            'room' => $room,
            'data' => $data['data'] ?? $data,
            'timestamp' => time(),
            'sender_id' => $sender ? $sender->resourceId : null
        ]);

        foreach ($this->rooms[$room] as $client) {
            if ($client !== $sender) {
                $client->send($message);
            }
        }
    }

    public function broadcastToRoom(string $room, array $data)
    {
        if (!isset($this->rooms[$room])) {
            return;
        }

        $message = json_encode([
            'type' => 'notification',
            'room' => $room,
            'data' => $data,
            'timestamp' => time()
        ]);

        foreach ($this->rooms[$room] as $client) {
            $client->send($message);
        }
    }

    public static function start(int $port = 8080)
    {
        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    new self()
                )
            ),
            $port,
            '0.0.0.0'
        );

        echo "WebSocket server started on port {$port}\n";
        $server->run();
    }
}
