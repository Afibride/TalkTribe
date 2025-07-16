<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestimonialsTableSeeder extends Seeder
{
    public function run()
    {
        // Clear existing testimonials
        DB::table('testimonials')->truncate();

        // Get all users or create some if none exist
        $users = User::all();
        
        if ($users->isEmpty()) {
            // Create 10 users if none exist
            $users = User::factory()->count(10)->create();
        }

        $testimonials = [
            [
                'text' => 'Thank you so much for your help. It\'s exactly what I\'ve been looking for. You won\'t regret it. It really saves me time and effort. TalkTribe is exactly what our kids who didn\'t have the opportunity to learn about their culture and language need.',
                'rating' => 5,
                'reviews' => '12 reviews at Yelp',
            ],
            [
                'text' => 'TalkTribe has been a game-changer for me. I\'ve learned so much about my culture and language in such a short time.',
                'rating' => 4,
                'reviews' => '8 reviews at Yelp',
            ],
            [
                'text' => 'The platform is amazing! The courses are interactive, and the instructors are very knowledgeable.',
                'rating' => 5,
                'reviews' => '15 reviews at Yelp',
            ],
            [
                'text' => 'I love how TalkTribe connects me with my roots. The lessons are fun and engaging!',
                'rating' => 5,
                'reviews' => '10 reviews at Yelp',
            ],
            [
                'text' => 'As someone who grew up away from my cultural community, TalkTribe has helped me reconnect in ways I never thought possible.',
                'rating' => 5,
                'reviews' => '20 reviews at Yelp',
            ],
        ];

        foreach ($testimonials as $testimonialData) {
            // Get a random user
            $user = $users->random();
            
            Testimonial::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'image' => $user->image, // Use the user's image field directly
                'text' => $testimonialData['text'],
                'rating' => $testimonialData['rating'],
                'reviews' => $testimonialData['reviews'],
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        // Generate additional random testimonials if in local environment
        if (app()->environment('local')) {
            Testimonial::factory()
                ->count(15)
                ->create([
                    'user_id' => fn() => User::inRandomOrder()->first()->id,
                    'name' => fn(array $attributes) => User::find($attributes['user_id'])->name,
                    'image' => fn(array $attributes) => User::find($attributes['user_id'])->image,
                ]);
        }
    }
}