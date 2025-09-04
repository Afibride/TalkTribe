<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
// database/seeders/DatabaseSeeder.php

public function run()
{
    $this->call([
        UsersTableSeeder::class,
        BlogCategoriesTableSeeder::class,
        BlogPostsTableSeeder::class,
        BlogPostCommentsTableSeeder::class,
        BlogPostLikesTableSeeder::class,
        NorthwestCameroonNewsSeeder::class,
    ]);
}

}
