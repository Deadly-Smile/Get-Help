<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $message;


    public function __construct($user, Message $message)
    {
        $this->user = $user;
        $this->message = $message;
    }


    public function broadcastOn()
    {
        // dd($this->messageData['receiver_id']);
        $roomname = array($this->user, $this->message['receiver_id']);
        sort($roomname);
        return new PrivateChannel('chat.' . $roomname[0] . $roomname[1]);
    }
}
