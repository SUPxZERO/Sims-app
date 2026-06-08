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
            'title' => fake()->randomElement([
                'Application Status Updated',
                'New Weekly Report Required',
                'Internship Evaluation Pending',
                'System Maintenance Notice'
            ]),
            'message' => fake()->randomElement([
                'Your internship application has been reviewed. Please check your dashboard for the latest status updates and next steps.',
                'Reminder: Your weekly internship report is due this Friday. Please ensure you log your hours and activities.',
                'A new evaluation form has been made available for your current internship. Please complete it at your earliest convenience.',
                'The system will undergo scheduled maintenance this weekend. Some features may be temporarily unavailable.'
            ]),
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
