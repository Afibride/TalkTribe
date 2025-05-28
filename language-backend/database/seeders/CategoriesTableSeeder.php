<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('categories')->insert([
            ['name' => 'Local Language', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Culture', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
