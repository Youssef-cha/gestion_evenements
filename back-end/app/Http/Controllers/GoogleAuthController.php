<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function handleGoogleCallback(Request $request)
    {
        $googleToken = $request->token;
        try {
            $googleUser = Socialite::driver('google')->userFromToken($googleToken);

            $user = User::updateOrCreate([
                'google_id' => $googleUser->id,
            ], [
                'google_id' => $googleUser->id,
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'avatar' => $googleUser->avatar,
                'password' => Hash::make(Str::random(16)),
                'email_verified_at' => now(),
            ]);
            $token = $user->createToken('google-token')->plainTextToken;
            $user->tokens()->latest()->update([
                'ip_address' => $request->ip(),
            ]);
            return response([
                'token' => $token,
            ], 200);
        } catch (\Exception $e) {
            return response(['error' => "failed to login with google"], 401);
        }
    }
}
