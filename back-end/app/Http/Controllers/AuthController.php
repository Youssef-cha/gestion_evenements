<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $credentials = $request->validate([
            "name" => ['required', 'string', 'max:50'],
            "email" => ['required', 'email', 'unique:users,email'],
            "password" => ['required', 'confirmed'],
        ]);
        $user = User::create($credentials);
        event(new Registered($user));
        $token = $user->createToken('auth-token')->plainTextToken;
        $user->tokens()->latest()->update([
            'ip_address' => $request->ip(),
        ]);
        return compact('token');
    }
    public function login(Request $request)
    {
        $credentials = $request->validate([
            "email" => ['required', 'email', 'exists:users,email'],
            "password" => ['required'],
        ]);
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;
            $user->tokens()->latest()->update([
                'ip_address' => $request->ip(),
            ]);
            return compact('token');
        }
        return response(['errors' => ['email' => ['email or password are incorrect']]], 422);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response(status: 204);
    }
    public function user(Request $request)
    {
        return new UserResource($request->user());
    }
    public function resendEmail(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();

        return response(['messsage' => 'verification email sent'], 200);
    }
    public function verifyEmail(EmailVerificationRequest $request)
    {
        $request->fulfill();
        return response(status: 204);
    }
}
