<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageStatusUpdated  implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messageId;
    public $senderId;
    public $userId;
    /**
     * Create a new event instance.
     */
    public function __construct($messageId, $senderId, $userId)
    {
        $this->messageId = $messageId;
        $this->senderId = $senderId;
        $this->userId = $userId;
        // dd("cons");
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        $roomname = array($this->userId, $this->senderId);
        sort($roomname);
        return new PrivateChannel('chat.' . $roomname[0] . $roomname[1]);
    }
}
