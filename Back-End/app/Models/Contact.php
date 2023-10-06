<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_1',
        'user_2'
    ];

    // Define a many-to-one relationship with the user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_1');
    }

    // Define a many-to-one relationship with the contact user
    public function contactUser()
    {
        return $this->belongsTo(User::class, 'user_2');
    }
}
