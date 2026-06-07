<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['SYSTEM', 'APPLICATION', 'INTERNSHIP', 'MESSAGE']),
            'title' => fake()->sentence(),
            'message' => fake()->paragraph(),
            'priority' => fake()->randomElement(['HIGH', 'MEDIUM', 'LOW']),
            'channel' => 'IN_APP',
            'reference_type' => null,
            'reference_id' => null,
            'is_read' => 0,
            'read_at' => null,
            'email_sent' => 0,
            'email_sent_at' => null,
        ];
    }
}
