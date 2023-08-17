<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
    ];

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function upvotes()
    {
        return $this->votes()->where('vote', 1);
    }

    public function downvotes()
    {
        return $this->votes()->where('vote', -1);
    }

    public function voteCount()
    {
        return $this->upvotes()->count() - $this->downvotes()->count();
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function author()
    {
        return $this->users()->get();
    }
}
