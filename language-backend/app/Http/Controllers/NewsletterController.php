<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Models\NewsletterSubscriber;
use App\Mail\NewsletterWelcomeMail;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:newsletter_subscribers,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email is invalid or already subscribed'
            ], 422);
        }

        try {
            // Save subscriber to database
            $subscriber = NewsletterSubscriber::create([
                'email' => $request->email,
                'subscribed_at' => now()
            ]);

            // Send welcome email
            Mail::to($request->email)->send(new NewsletterWelcomeMail());

            return response()->json([
                'success' => true,
                'message' => 'Successfully subscribed to newsletter'
            ]);
        } catch (\Exception $e) {
            Log::error('Newsletter subscription error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to subscribe. Please try again later.'
            ], 500);
        }
    }
}