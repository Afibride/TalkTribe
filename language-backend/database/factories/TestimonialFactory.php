<?php

namespace Database\Factories;

use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TestimonialFactory extends Factory
{
    protected $model = Testimonial::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'name' => fn(array $attributes) => User::find($attributes['user_id'])->name,
            'image' => fn(array $attributes) => User::find($attributes['user_id'])->image ?? 'user.jpg',
            'text' => $this->faker->paragraphs(2, true),
            'rating' => $this->faker->numberBetween(3, 5),
            'reviews' => $this->faker->numberBetween(5, 30) . ' reviews at Yelp',
            'created_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }

    public function withExistingUser(User $user)
    {
        return $this->state([
            'user_id' => $user->id,
            'name' => $user->name,
            'image' => $user->image,
        ]);
    }
}