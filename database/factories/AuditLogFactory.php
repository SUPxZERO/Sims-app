<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuditLogFactory extends Factory
{
    protected $model = AuditLog::class;

    public function definition(): array
    {
        return [
            'table_name' => fake()->randomElement(['users', 'applications', 'internships']),
            'record_id' => fake()->numberBetween(1, 100),
            'action' => fake()->randomElement(['INSERT', 'UPDATE', 'DELETE']),
            'old_values' => null,
            'new_values' => ['status' => 'UPDATED'],
            'changed_by' => User::factory(),
            'changed_at' => now(),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }
}
