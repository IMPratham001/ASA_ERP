
<?php

namespace App\Events;

use App\Models\Product;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $product;
    public $action;

    public function __construct(Product $product, string $action = 'updated')
    {
        $this->product = $product;
        $this->action = $action;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('company.' . $this->product->company_id);
    }

    public function broadcastWith()
    {
        return [
            'type' => 'product_updated',
            'action' => $this->action,
            'product' => $this->product->toArray(),
            'timestamp' => now()->toISOString()
        ];
    }
}
