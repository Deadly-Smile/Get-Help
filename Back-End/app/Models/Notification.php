<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'is_read', 'content', 'triggered_user_id', 'receiver_user_id'];

    // Define any relationships if needed
    // For example:
    // public function triggeredUser()
    // {
    //     return $this->belongsTo(User::class, 'triggered_user_id');
    // }

    public function receiverUser()
    {
        return $this->belongsTo(User::class, 'receiver_user_id');
    }
}
