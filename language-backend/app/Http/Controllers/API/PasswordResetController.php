<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\CustomResetPasswordMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
 
    
    public function sendResetLinkEmail(Request $request)
    {
        // 🔍 Validate the email
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }
    
        $email = $request->email;
        $user = User::where('email', $email)->first(); // ✅ now we have $user
    
        // 🧪 Generate token
        $token = Str::random(64);
    
        // 💾 Save token to DB (or update existing one)
        DB::table('password_resets')->updateOrInsert(
            ['email' => $email],
            [
                'email' => $email,
                'token' => $token,
                'created_at' => Carbon::now(),
            ]
        );
    
        // ✉️ Send email with the token
        Mail::to($user->email)->send(new CustomResetPasswordMail($token, $user->email));
    
        return response()->json(['message' => 'Reset link sent to your email.'], 200);
    }
    
    /**
     * Handle the password reset request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function reset(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if token exists and is valid
        $tokenData = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$tokenData) {
            return response()->json([
                'message' => 'Invalid or expired token.'
            ], 400);
        }

        // Update the user's password
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the reset token
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password reset successful.'
        ]);
    }
}

