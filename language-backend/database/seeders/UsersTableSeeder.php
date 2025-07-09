<?php

namespace Database\Seeders;

// database/seeders/UsersTableSeeder.php

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create regular users
        $users = [
            ['name' => 'Language Expert', 'email' => 'expert@example.com', 'role' => 'instructor'],
            ['name' => 'Cultural Historian', 'email' => 'historian@example.com', 'role' => 'instructor'],
            ['name' => 'Community Member', 'email' => 'member@example.com', 'role' => 'user'],
            ['name' => 'Local Guide', 'email' => 'guide@example.com', 'role' => 'instructor'],
        ];

        foreach ($users as $user) {
            User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password'),
                'role' => $user['role'],
            ]);
        }

        // Create additional random users
        User::factory()->count(10)->create();
    }
}
