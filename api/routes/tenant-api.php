<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Tenant\AuthController as TenantAuthController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use Stancl\Tenancy\Middleware\InitializeTenancyByPath;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/


// Route::group([
//     'prefix' => '/{tenant}',
//     'middleware' => [InitializeTenancyByPath::class],
// ], function () {
//     Route::get('/foo', 'FooController@index');
// });



Route::group([
    'prefix' => '{tenant}',
    'middleware' => [
        'api',
        InitializeTenancyByPath::class,
    ],
], function () {
    Route::get('sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);
    Route::post('register', [TenantAuthController::class, 'register']);
    Route::post('login', [TenantAuthController::class, 'login']);
    Route::middleware('auth:tenant')->group(function () {
        Route::get('me', [TenantAuthController::class, 'me']);
        Route::post('logout', [TenantAuthController::class, 'logout']);
    });
});



// Route::prefix('tenant/{tenant}')->group(function () {
//     Route::post('register', [TenantAuth::class, 'register']);
//     Route::post('login', [TenantAuth::class, 'login']);
//     Route::middleware(['tenancy', 'auth:tenant'])->group(function () {
//         Route::get('me', [TenantAuth::class, 'me']);
//         Route::post('logout', [TenantAuth::class, 'logout']);
//     });
// });
