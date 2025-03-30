<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

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
    function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::ResetLinkSent
            ? response(['message' => __($status)], 200)
            : response(['message' => __($status)], 422);
    }
    public function passwordReset(string $token)
    {
        $email = request()->query('email');
        return redirect(env('FRONTEND_URL') . '/reset-password?token=' . $token . '&email=' . $email);
    }
    public function passwordResetUpdate(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PasswordReset
            ? response(['message' => __($status)], 200)
            : response(['message' => __($status)], 422);
    }
}
