<?php

namespace Database\Factories;

use App\Models\WeeklyReport;
use App\Models\Internship;
use Illuminate\Database\Eloquent\Factories\Factory;

class WeeklyReportFactory extends Factory
{
    protected $model = WeeklyReport::class;

    public function definition(): array
    {
        return [
            'internship_id' => Internship::factory(),
            'week_number' => 1,
            'week_start_date' => now()->startOfWeek(),
            'week_end_date' => now()->endOfWeek(),
            'activities' => fake()->paragraph(),
            'challenges' => fake()->paragraph(),
            'learnings' => fake()->paragraph(),
            'hours_logged' => fake()->randomFloat(1, 30, 40),
            'status' => 'SUBMITTED',
            'is_late' => 0,
            'revision_count' => 0,
            'submitted_at' => now(),
            'approved_at' => null,
        ];
    }
    
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'APPROVED',
            'approved_at' => now(),
        ]);
    }
}
