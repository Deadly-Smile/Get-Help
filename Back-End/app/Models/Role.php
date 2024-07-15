<?php

namespace App\Models;

use App\Models\User;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function permissions()
    {
        return $this->belongsToMany(Permission::class)->get();
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function getAllPermissions()
    {
        $permissions = array();
        foreach ($this->permissions() as $permission) {
            array_push($permissions, $permission->name);
        }
        return $this->permissions();
    }
}
