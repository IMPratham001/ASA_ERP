
<?php

namespace App\Events;

use App\Models\Customer;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CustomerUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $customer;
    public $action;

    public function __construct(Customer $customer, string $action = 'updated')
    {
        $this->customer = $customer;
        $this->action = $action;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('company.' . $this->customer->company_id);
    }

    public function broadcastWith()
    {
        return [
            'type' => 'customer_updated',
            'action' => $this->action,
            'customer' => $this->customer->toArray(),
            'timestamp' => now()->toISOString()
        ];
    }
}
