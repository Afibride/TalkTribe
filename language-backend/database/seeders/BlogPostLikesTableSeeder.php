<?php

namespace Database\Seeders;

// database/seeders/BlogPostLikesTableSeeder.php

use App\Models\BlogPost;
use App\Models\BlogPostLike;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogPostLikesTableSeeder extends Seeder
{
    public function run()
    {
        $posts = BlogPost::all();
        $users = User::all();

        foreach ($posts as $post) {
            // Get a random number of unique users who will like this post
            $likeCount = rand(5, min($users->count(), 20)); // Ensure we don't exceed user count
            $likers = $users->random($likeCount);
            
            foreach ($likers as $user) {
                // Use firstOrCreate to prevent duplicates
                BlogPostLike::firstOrCreate([
                    'user_id' => $user->id,
                    'blog_post_id' => $post->id,
                ], [
                    'created_at' => $post->created_at->addDays(rand(0, 14)),
                ]);
            }
        }
    }
}