<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use App\Models\TenantUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = TenantUser::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Registered successfully', 'user' => $user], 201);
    }

    // Login (returns token if requested, else session)
    public function login(Request $request, Tenant $tenant)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = TenantUser::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // 1️⃣ If it's an API route, always token-based:
        // Check if this is a tenant API route: /{tenant}/api/*
        // We check if the path is like 'TENANT/api/*'
        $segments = $request->segments();
        if (count($segments) > 1 && $segments[1] === 'api') {
            $token = $user->createToken('tenant-api')->plainTextToken;
            return response()->json([
                'message' => 'Logged in (token)',
                'token'   => $token,
                'user'    => $user,
            ]);
        }

        // 2️⃣ Otherwise, always session/cookie-based:
        Auth::guard('tenant')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Logged in (session)',
            'user'    => $user,
        ]);
    }

    // /me endpoint (works for both modes)
    public function me(Request $request)
    {
        $user = currentUser();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        return response()->json(['user' => $user]);
    }

    // Logout (both session and token)
    public function logout(Request $request)
    {
        $user = currentUser();

        // Session/cookie logout
        if (Auth::guard('tenant')->check()) {
            Auth::guard('tenant')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        // Token logout (delete current access token)
        if ($user && method_exists($user, 'currentAccessToken')) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logged out']);
    }
}
