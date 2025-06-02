<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LandlordUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Register (API or session)
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:landloard_users,email', // Correct table!
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = LandlordUser::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Registered successfully', 'user' => $user], 201);
    }

    // Login (returns token if requested, else session)
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = LandlordUser::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // 1️⃣ If it's an API route, always token-based:
        if ($request->is('api/*')) {
            $token = $user->createToken('landlord-api')->plainTextToken;
            return response()->json([
                'message' => 'Logged in (token)',
                'token'   => $token,
                'user'    => $user,
            ]);
        }

        // 2️⃣ Otherwise, always session/cookie-based:
        Auth::guard('landlord')->login($user);
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
        if (Auth::guard('landlord')->check()) {
            Auth::guard('landlord')->logout();
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
