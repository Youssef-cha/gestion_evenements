<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\NullableType;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $credentials = $request->validate([
            "name" => ['required', 'string', 'max:50'],
            "email" => ['required', 'email', 'unique:users,email'],
            "password" => ['required', 'confirmed'],
        ]);
        $user = new UserResource(User::create($credentials));
        $token = $user->createToken('auth-token')->plainTextToken;
        return compact('user', 'token');
    }
    public function login(Request $request)
    {
        $credentials = $request->validate([
            "email" => ['required', 'email', 'exists:users,email'],
            "password" => ['required'],
        ]);
        if (Auth::attempt($credentials)) {
            $user = new UserResource(Auth::user());
            $token = $user->createToken('auth-token')->plainTextToken;
            return compact('user', 'token');
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
}
