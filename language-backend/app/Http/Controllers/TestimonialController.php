<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        return response()->json(Testimonial::latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|string',
            'text' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'reviews' => 'nullable|string',
        ]);
        $testimonial = Testimonial::create($data);
        return response()->json($testimonial, 201);
    }
}
