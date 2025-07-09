<?php

namespace Database\Seeders;

// database/seeders/BlogCategoriesTableSeeder.php

use App\Models\BlogCategory;
use Illuminate\Database\Seeder;

class BlogCategoriesTableSeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'Language Preservation', 'slug' => 'language-preservation'],
            ['name' => 'Cultural Heritage', 'slug' => 'cultural-heritage'],
            ['name' => 'Teaching Methods', 'slug' => 'teaching-methods'],
            ['name' => 'Community Stories', 'slug' => 'community-stories'],
            ['name' => 'Language Technology', 'slug' => 'language-technology'],
        ];

        foreach ($categories as $category) {
            BlogCategory::create($category);
        }
    }
}
