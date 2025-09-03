<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use App\Mail\ContactAutoReplyMail;

class ContactController extends Controller
{
    public function sendContactEmail(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        try {
            // Send email to admin
            Mail::to('afibright07@gmail.com')->send(new ContactFormMail(
                $request->name,
                $request->email,
                $request->subject,
                $request->message
            ));

            // Send auto-reply to user
            Mail::to($request->email)->send(new ContactAutoReplyMail(
                $request->name,
                $request->subject
            ));

            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully! You should receive a confirmation email shortly.'
            ]);
        } catch (\Exception $e) {
            Log::error('Contact form error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.'
            ], 500);
        }
    }
}