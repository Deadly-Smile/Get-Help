<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        "sender_id",
        'receiver_id',
        'content',
        'sender_username',
        'receiver_username'

    ];
    // Define a many-to-one relationship with the sender user
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Define a many-to-one relationship with the receiver user
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
