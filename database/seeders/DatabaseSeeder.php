<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'demo@salescraft.ai'],
            [
                'name' => 'Demo User',
                'email' => 'demo@salescraft.ai',
                'password' => bcrypt('salescraft2026'),
                'email_verified_at' => now(),
            ]
        );
    }
}
