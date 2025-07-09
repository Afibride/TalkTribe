<?php

namespace Database\Seeders;

// database/seeders/BlogPostCommentsTableSeeder.php

use App\Models\BlogPost;
use App\Models\BlogPostComment;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogPostCommentsTableSeeder extends Seeder
{
    public function run()
    {
        $posts = BlogPost::all();
        $users = User::all();

        $sampleComments = [
            "This is really insightful, thank you!",
            "I never thought about it this way before.",
            "My grandmother used to tell similar stories.",
            "How can I get involved in this project?",
            "We should organize more events like this!",
            "This brings back so many memories.",
            "Is there research to support this approach?",
            "Our community needs more of this content.",
            "Can you recommend resources to learn more?",
            "This is exactly what we've been missing!",
        ];

        foreach ($posts as $post) {
            $commentCount = rand(2, 10);
            
            for ($i = 0; $i < $commentCount; $i++) {
                BlogPostComment::create([
                    'user_id' => $users->random()->id,
                    'blog_post_id' => $post->id,
                    'content' => $sampleComments[array_rand($sampleComments)],
                    'created_at' => $post->created_at->addDays(rand(0, 7)),
                ]);
            }
        }
    }
}
