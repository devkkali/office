<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Landlord\AuthController as LandlordAuthController;
use App\Http\Controllers\Landlord\TenantController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



// foreach (config('tenancy.central_domains') as $domain) {
//     Route::domain($domain)->middleware(['web', 'api'])
//     // Route::domain($domain)
//         ->group(function () {
//             Route::post('register', [LandlordAuthController::class, 'register']);
//             Route::post('login', [LandlordAuthController::class, 'login']);
//             Route::middleware('auth:landlord')->group(function () {
//                 Route::get('me', [LandlordAuthController::class, 'me']);
//                 Route::post('logout', [LandlordAuthController::class, 'logout']);
//                 Route::post('tenants', [TenantController::class, 'store']);
//             });
//         });
// }


// foreach (config('tenancy.central_domains') as $domain) {
//     Route::domain($domain)->middleware([
//         'web', // Required for session/cookie/CSRF features
//         'api',
//     ])->group(function () {
//         Route::post('register', [LandlordAuthController::class, 'register']);
//         Route::post('login', [LandlordAuthController::class, 'login']);
//         Route::middleware('auth:landlord')->group(function () {
//             Route::get('me', [LandlordAuthController::class, 'me']);
//             Route::post('logout', [LandlordAuthController::class, 'logout']);
//             Route::post('tenants', [TenantController::class, 'store']);
//         });
//     });
// }