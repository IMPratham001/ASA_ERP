
#!/bin/bash

# Start Laravel development server in background
echo "Starting Laravel server on port 8000..."
php artisan serve --host=0.0.0.0 --port=8000 &
LARAVEL_PID=$!

# Start WebSocket server in background
echo "Starting WebSocket server on port 8080..."
php artisan websocket:serve --port=8080 &
WEBSOCKET_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $LARAVEL_PID 2>/dev/null
    kill $WEBSOCKET_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script termination
trap cleanup SIGTERM SIGINT

echo "Both servers are running!"
echo "Laravel API: http://0.0.0.0:8000"
echo "WebSocket: ws://0.0.0.0:8080"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
