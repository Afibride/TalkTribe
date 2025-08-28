<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use App\Models\User;

class AuthController extends Controller
{
    // ✅ Register User
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'username' => 'required|string|unique:users',
            'phone' => 'required|string|unique:users',
            'password' => 'required|string|confirmed|min:6',
        ]);
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'phone' => $request->input('phone'),
            'password' => Hash::make($request['password']),
            'role' => $request->role ?? 'learner', // 👈 sets default if not sent
        ]);
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Account created successfully! Please log in.',
        ]);
    }
    

    // ✅ Login User
    public function login(Request $request)
    {
        $credentials = $request->only('login', 'password');
    
        $fieldType = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
    
        $user = User::where($fieldType, $credentials['login'])->first();
    
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        $token = $user->createToken('authToken')->plainTextToken;
    
        $isNewUser = $user->last_login_at === null;
    
        // Update last login timestamp
        $user->last_login_at = now();
        $user->save();
    
        return response()->json([
            'token' => $token,
            'user' => $user,
            'is_new_user' => $isNewUser,
        ]);
    }
    

    public function getCurrentUser(Request $request)
{
    return response()->json($request->user());
}
    
    


    // ✅ Logout (Revoke Current Token)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
    
}
