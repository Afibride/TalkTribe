<?php

namespace Database\Factories;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlogPostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BlogPost::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'title' => $this->faker->sentence,
            'content' => $this->faker->paragraphs(3, true),
            'image' => 'blog_images/'.$this->faker->image('public/storage/blog_images', 800, 600, null, false),
            'likes_count' => $this->faker->numberBetween(0, 100),
            'comments_count' => $this->faker->numberBetween(0, 50),
            'shares_count' => $this->faker->numberBetween(0, 20),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}