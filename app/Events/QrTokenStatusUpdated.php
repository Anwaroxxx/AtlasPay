<?php

namespace App\Events;

use App\Models\Token;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QrTokenStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $token;

    /**
     * Create a new event instance.
     */
    public function __construct(Token $token)
    {
        $this->token = $token->load(['fromAccount.user', 'toAccount.user']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('qr-token.' . $this->token->token),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'status' => $this->token->status,
            'token' => $this->token->token,
            'amount' => $this->token->amount,
            'from_user' => $this->token->fromAccount?->user?->name,
            'to_user' => $this->token->toAccount?->user?->name,
            'goal' => $this->token->goal,
        ];
    }

    public function broadcastAs(): string
    {
        return 'QrTokenStatusUpdated';
    }
}
