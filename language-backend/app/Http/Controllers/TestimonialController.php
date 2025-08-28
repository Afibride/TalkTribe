<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestimonialController extends Controller
{
public function index(Request $request)
{
    try {
        $limit = $request->query('limit', null);
        
        $query = Testimonial::with(['user' => function($query) {
            $query->select('id', 'name', 'image');
        }])->latest();
        
        if ($limit) {
            $query->take($limit);
        }
        
        $testimonials = $query->get();
        
        $transformed = $testimonials->map(function($testimonial) {
            return array_merge(
                $testimonial->toArray(),
                [
                    'image_url' => $testimonial->user ? $testimonial->user->profile_pic_url : null,
                    'name' => $testimonial->user ? $testimonial->user->name : $testimonial->name
                ]
            );
        });
        
        return response()->json($transformed);
        
    } catch (\Exception $e) {
        \Log::error('Testimonials index error: ' . $e->getMessage());
        return response()->json([
            'error' => 'Server error',
            'message' => $e->getMessage()
        ], 500);
    }
}

public function store(Request $request)
{
    $user = Auth::user();
    
    $validated = $request->validate([
        'text' => 'required|string|max:1000',
        'rating' => 'required|integer|min:1|max:5',
        'reviews' => 'nullable|string|max:255',
    ]);
    
    $testimonial = Testimonial::create([
        'user_id' => $user->id,
        'name' => $user->name,
        'image' => $user->image,
        'text' => $validated['text'],
        'rating' => $validated['rating'],
        'reviews' => $validated['reviews'] ?? null,
    ]);
    
    // Load the user relationship to ensure we have access to user data
    $testimonial->load('user');
    
    // Return the testimonial with additional image_url field
    return response()->json([
        'id' => $testimonial->id,
        'user_id' => $testimonial->user_id,
        'name' => $testimonial->name,
        'image' => $testimonial->image,
        'text' => $testimonial->text,
        'rating' => $testimonial->rating,
        'reviews' => $testimonial->reviews,
        'created_at' => $testimonial->created_at,
        'updated_at' => $testimonial->updated_at,
        'image_url' => $user->profile_pic_url,
    ], 201);
}
}