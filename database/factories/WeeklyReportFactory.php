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
            'activities' => fake()->randomElement([
                "Set up the local development environment. Attended onboarding sessions and met the engineering team. Started reading the system architecture documentation.",
                "Assigned my first Jira ticket. Implemented a new REST endpoint for user profile retrieval. Wrote unit tests for the new endpoint using PHPUnit.",
                "Participated in sprint planning. Refactored the legacy authentication module to use JWT tokens. Collaborated with the frontend team to integrate the new auth flow.",
                "Worked on optimizing database queries that were causing performance bottlenecks. Created new indexes and rewrote several complex JOINs."
            ]),
            'challenges' => fake()->randomElement([
                "Struggled initially with setting up Docker and understanding the networking between the local containers. Reached out to a senior developer for help.",
                "Found it challenging to understand the legacy codebase without much documentation. Had to trace the execution flow step by step.",
                "Ran into some Git merge conflicts when rebasing my branch onto the latest main. Managed to resolve them after carefully reviewing the diffs.",
                "Had difficulty figuring out the right assertions to use for a complex integration test, but eventually found the solution in the framework's documentation."
            ]),
            'learnings' => fake()->randomElement([
                "Learned how to properly use Docker Compose for local environment orchestration. Gained a better understanding of microservices architecture.",
                "Deepened my knowledge of Laravel's Eloquent ORM, specifically how to use eager loading to prevent N+1 query problems.",
                "Gained practical experience with Git workflow in a team setting, including creating pull requests and responding to code reviews.",
                "Learned about the importance of writing clean, maintainable code and the principles of SOLID design."
            ]),
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
