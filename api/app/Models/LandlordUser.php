<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class LandlordUser extends Authenticatable
{
    use HasApiTokens, HasRoles;
    protected $table = 'users';
    protected $fillable = [
        'name',
        'email',
        'password',
    ];


    protected $guard_name = 'landlord';
}
