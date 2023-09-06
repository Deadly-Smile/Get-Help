<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    // Define a many-to-one relationship with the user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Define a many-to-one relationship with the contact user
    public function contactUser()
    {
        return $this->belongsTo(User::class, 'contact_id');
    }
}
