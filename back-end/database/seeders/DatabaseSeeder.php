<?php

namespace Database\Seeders;

use App\Models\Event;
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
        $user = User::factory()->create([
            'name' => 'youssef charroud',
            'email' => 'youssef@email.com',
            'password' => bcrypt('123'),
        ]);
        EventCategory::factory()->has(Event::factory(10)->for($user))->create();
        EventCategory::factory(2)->has(Event::factory(5)->for($user))->create();
        EventCategory::factory(3)->has(Event::factory(1)->for($user))->create();
    }
}
