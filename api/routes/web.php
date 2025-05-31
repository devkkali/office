<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Landlord\AuthController as LandlordAuthController;
use App\Http\Controllers\Landlord\TenantController;

Route::get('/', function () {
    return view('welcome');
});





foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->middleware([
        'web', // Required for session/cookie/CSRF features
        'api',
    ])->group(function () {
        Route::post('register', [LandlordAuthController::class, 'register']);
        Route::post('login', [LandlordAuthController::class, 'login']);
        Route::middleware('auth:landlord')->group(function () {
            Route::get('me', [LandlordAuthController::class, 'me']);
            Route::post('logout', [LandlordAuthController::class, 'logout']);
            Route::post('tenants', [TenantController::class, 'store']);
        });
    });
}