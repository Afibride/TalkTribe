<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Models\NewsletterSubscriber;
use App\Mail\NewsletterWelcomeMail;
use App\Mail\NewsletterUnsubscribeMail;

class NewsletterController extends Controller
{
    // ... existing subscribe method ...

    public function unsubscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:newsletter_subscribers,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email not found in our subscription list'
            ], 422);
        }

        try {
            $subscriber = NewsletterSubscriber::where('email', $request->email)->first();

            if ($subscriber->unsubscribed_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'This email is already unsubscribed'
                ], 422);
            }

            // Update subscriber status
            $subscriber->update([
                'unsubscribed_at' => now(),
                'unsubscribe_reason' => $request->reason
            ]);

            // Send confirmation email
            Mail::to($request->email)->send(new NewsletterUnsubscribeMail());

            return response()->json([
                'success' => true,
                'message' => 'Successfully unsubscribed from newsletter'
            ]);

        } catch (\Exception $e) {
            Log::error('Newsletter unsubscribe error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to unsubscribe. Please try again later.'
            ], 500);
        }
    }

    public function showUnsubscribeForm(Request $request)
    {
        $email = $request->query('email');
        $subscriber = null;

        if ($email) {
            $subscriber = NewsletterSubscriber::where('email', $email)->first();
        }

        return view('newsletter.unsubscribe', compact('email', 'subscriber'));
    }

    public function resubscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:newsletter_subscribers,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email not found'
            ], 422);
        }

        try {
            $subscriber = NewsletterSubscriber::where('email', $request->email)->first();
            
            $subscriber->update([
                'unsubscribed_at' => null,
                'unsubscribe_reason' => null,
                'subscribed_at' => now()
            ]);

            // Send welcome back email
            Mail::to($request->email)->send(new NewsletterWelcomeMail());

            return response()->json([
                'success' => true,
                'message' => 'Successfully resubscribed to newsletter'
            ]);

        } catch (\Exception $e) {
            Log::error('Newsletter resubscribe error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to resubscribe. Please try again later.'
            ], 500);
        }
    }
}