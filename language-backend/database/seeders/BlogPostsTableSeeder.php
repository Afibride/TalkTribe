<?php

namespace Database\Seeders;

// database/seeders/BlogPostsTableSeeder.php

use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogPostsTableSeeder extends Seeder
{
    public function run()
    {
        $users = User::whereIn('role', ['instructor', 'admin'])->get();
        $categories = BlogCategory::all();
        
        $posts = [
            [
                'title' => 'The Importance of Preserving Local Languages',
                'content' => 'Local languages carry cultural knowledge and identity. When a language disappears, we lose unique ways of understanding the world...',
                'image' => 'blog_images/preservation.jpg',
            ],
            [
                'title' => 'Traditional Storytelling Techniques',
                'content' => 'Our ancestors used storytelling to pass down knowledge. Here are techniques we can use to keep these traditions alive...',
                'image' => 'blog_images/storytelling.jpg',
            ],
            [
                'title' => 'Digital Tools for Language Learning',
                'content' => 'Modern technology offers exciting ways to document and teach local languages. Here are some tools our community is using...',
                'image' => 'blog_images/technology.jpg',
            ],
            [
                'title' => 'Community Language Documentation Project',
                'content' => 'We are launching a new initiative to document our native language. Here is how you can participate...',
                'image' => 'blog_images/documentation.jpg',
            ],
        ];

        foreach ($posts as $post) {
            $newPost = BlogPost::create([
                'user_id' => $users->random()->id,
                'title' => $post['title'],
                'content' => $post['content'],
                'image' => $post['image'],
                'likes_count' => rand(5, 50),
                'comments_count' => rand(2, 20),
                'shares_count' => rand(1, 10),
                'created_at' => now()->subDays(rand(1, 30)),
            ]);

            // Attach 1-3 random categories to each post
            $newPost->categories()->attach(
                $categories->random(rand(1, 3))->pluck('id')
            );
        }

        // Create additional random posts
        BlogPost::factory()->count(15)->create();
    }
}
