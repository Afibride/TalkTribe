<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        Log::info('Authenticated User:', ['user' => auth()->user()]);


        $user = $request->user(); // Comes from token
        return response()->json([
            'message' => 'Welcome back!',
            'user' => $user,
        ]);
    }
    
}

