<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
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
        'verify_token'
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

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function userHasRole($role_name): bool
    {
        foreach ($this->roles() as $role) {
            if($role->name == $role_name) return true;
        }
        return false;
    }

    public function userHasPermission($permission_name): bool
    {
        foreach ($this->permissions() as $permission) {
            if($permission->slag == $permission_name) return true;
        }
        return false;
    }

}
