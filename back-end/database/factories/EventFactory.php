<?php

namespace Database\Factories;

use App\Models\EventCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start_time = $this->faker->dateTimeThisDecade();
        $end_time = $this->faker->dateTimeBetween($start_time, '+1 month');
        return [
            "user_id" => User::factory(),
            "title" => $this->faker->sentence(3),
            "description" => $this->faker->paragraph(),
            "start_time" => $start_time,
            "end_time" => $end_time,
            "location" => $this->faker->address(),
            "event_category_id" => EventCategory::factory(),
        ];
    }
}
