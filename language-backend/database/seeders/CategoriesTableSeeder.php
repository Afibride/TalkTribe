<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    public function run()
    {
     DB::table('categories')->truncate();

DB::table('categories')->insert([
    [
        'name' => 'Dialects Studies',
        'icon' => 'https://img.icons8.com/color/96/translation.png',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'name' => 'Culture & Arts Studies',
        'icon' => '	https://img.icons8.com/color/96/festival.png',
        'created_at' => now(),
        'updated_at' => now(),
    ],

   
    [
        'name' => 'Festivals & Celebrations',
        'icon' => 'https://img.icons8.com/color/96/festival.png',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'name' => 'Storytelling & Folklore',
        'icon' => 'https://img.icons8.com/color/96/storytelling.png',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'name' => 'Traditions & Customs',
        'icon' => 'https://img.icons8.com/color/96/kimono.png',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'name' => 'History & Heritage',
        'icon' => 'https://img.icons8.com/color/96/historical.png',
        'created_at' => now(),
        'updated_at' => now(),
    ],

]);

    }
}
