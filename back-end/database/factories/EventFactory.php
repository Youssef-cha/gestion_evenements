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
        return [
            "user_id" => User::factory(),
            "title" => $this->faker->word(),
            "description" => $this->faker->sentence(),
            "start_time" => $this->faker->dateTimeBetween('-1 week', '+1 week'),
            "end_time" => $this->faker->dateTimeBetween('-1 week', '+1 week'),
            "location" => $this->faker->word(),
            "event_category_id" => EventCategory::factory(),
            "all_day" => $this->faker->numberBetween(0, 1),
        ];
    }
}
