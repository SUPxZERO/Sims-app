<?php

namespace Database\Factories;

use App\Models\Internship;
use App\Models\Application;
use App\Models\User;
use App\Models\InternshipListing;
use Illuminate\Database\Eloquent\Factories\Factory;

class InternshipFactory extends Factory
{
    protected $model = Internship::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-3 months', '-1 month');
        $endDate = (clone $startDate)->modify('+12 weeks');

        return [
            'application_id' => Application::factory()->confirmed(),
            'student_user_id' => User::factory()->student(),
            'company_user_id' => User::factory()->company(),
            'lecturer_user_id' => User::factory()->lecturer(),
            'listing_id' => InternshipListing::factory(),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'total_weeks' => 12,
            'status' => 'ACTIVE',
            'confirmed_by' => 1, // Usually Admin ID 1
            'report_deadline_day' => 'SUNDAY',
        ];
    }
    
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'COMPLETED',
            'start_date' => now()->subWeeks(14)->format('Y-m-d'),
            'end_date' => now()->subWeeks(2)->format('Y-m-d'),
        ]);
    }
}
