<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class TenantUser extends Authenticatable
{
    use HasApiTokens, HasRoles, Notifiable;
    protected $table = 'users';


    protected $guard_name = 'tenant';
}
