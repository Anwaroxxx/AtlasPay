<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GenericNotification implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $title;
    public $message;
    public $userId;
    public $type;
    public $actionUrl;

    /**
     * Create a new event instance.
     */
    public function __construct($userId, $title, $message, $type = 'info', $actionUrl = null)
    {
        $this->userId = $userId;
        $this->title = $title;
        $this->message = $message;
        $this->type = $type;
        $this->actionUrl = $actionUrl;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.User.' . $this->userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'notification.generic';
    }
}
