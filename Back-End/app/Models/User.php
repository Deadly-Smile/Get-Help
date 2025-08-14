<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Message;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Tymon\JWTAuth\Contracts\JWTSubject; // Import the JWTSubject interface

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, Notifiable;

    // Method required by JWTSubject interface to get the identifier (usually the primary key) of the user
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    // Method required by JWTSubject interface to define custom claims for the JWT token
    public function getJWTCustomClaims(): array
    {
        return [
            // You can add any custom claims you want to include in the token
            'user_role' => $this->role,
            // Add more custom claims as needed
        ];
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'verify_token',
        'status',
        'pending_subscriber'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function posts()
    {
        return $this->belongsToMany(Post::class);
    }

    public function userHasRole($role_name): bool
    {
        foreach ($this->roles()->get() as $role) {
            if ($role->slug === $role_name) {
                return true;
            }
        }
        return false;
    }

    public function getAllPermissions()
    {
        $permissions = array();
        foreach ($this->roles()->get() as $role) {
            foreach ($role->getAllPermissions() as $permission) {
                array_push($permissions, $permission->slug);
            }
        }
        return $permissions;
    }

    public function userHasPermission($permission_name): bool
    {
        foreach ($this->roles()->get() as $role) {
            foreach ($role->permissions()->get() as $permission) {
                if ($permission->slug === $permission_name) return true;
            }
        }
        return false;
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function hasVoted(Post $post)
    {
        return $this->votes()->where('post_id', $post->id)->exists();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function replies()
    {
        return $this->hasMany(Reply::class);
    }

    public function getStatusAttribute()
    {
        return $this->attributes['status'] == 1 ? 'Active' : 'Inactive';
    }

    // Define a one-to-many relationship between User and Messaging
    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    // Define a many-to-many relationship between User and Contact
    public function contacts()
    {
        return $this->belongsToMany(User::class, 'contacts', 'user_id', 'contact_id');
    }
}
