
<?php

return [
    'default' => env('BROADCAST_DRIVER', 'websockets'),
    
    'connections' => [
        'websockets' => [
            'driver' => 'websockets',
            'key' => env('WEBSOCKET_KEY'),
            'secret' => env('WEBSOCKET_SECRET'),
            'app_id' => env('WEBSOCKET_APP_ID'),
            'options' => [
                'cluster' => env('WEBSOCKET_CLUSTER', 'mt1'),
                'host' => env('WEBSOCKET_HOST', '0.0.0.0'),
                'port' => env('WEBSOCKET_PORT', 6001),
                'scheme' => env('WEBSOCKET_SCHEME', 'http')
            ],
        ],
    ],
];
