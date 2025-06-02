<?php
use Illuminate\Support\Facades\Auth;

if (!function_exists('currentUser')) {
    function currentUser() {
        // Try session/cookie first, then sanctum token
        return Auth::guard('landlord')->user() ?? Auth::user();
    }
}
