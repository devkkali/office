<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * @mixin \Laravel\Sanctum\HasApiTokens
 */
class LandlordUser extends Authenticatable
{
    use HasApiTokens, HasRoles, Notifiable;
    protected $table = 'users';
    protected $fillable = [
        'name',
        'email',
        'password',
    ];


    protected $guard_name = 'landlord';
}
