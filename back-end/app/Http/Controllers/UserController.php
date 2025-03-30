<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function update(UpdateUserRequest $request)
    {
        $user = auth()->user();

        $userData = $request->validated();

        // Update name and email
        $user->update([
            'name' => $userData['name'],
            'email' => $userData['email']
        ]);

        // Update password if provided
        if (isset($userData['old_password']) && isset($userData['password'])) {
            if (!Hash::check($userData['old_password'], $user->password)) {
                return response(['message' => 'Current password is incorrect'], 422);
            }

            $user->update([
                'password' => Hash::make($userData['password'])
            ]);
        }

        return response(['message' => 'User updated successfully'], 200);
    }
}
