<?php

namespace Database\Seeders;

use App\Models\EventCategory;
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

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        EventCategory::factory()->hasEvents(10)->create();
        EventCategory::factory(2)->hasEvents(5)->create();
        EventCategory::factory(4)->hasEvents(6)->create();


    }
}
