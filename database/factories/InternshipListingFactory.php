<?php

namespace Database\Factories;

use App\Models\InternshipListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InternshipListingFactory extends Factory
{
    protected $model = InternshipListing::class;

    public function definition(): array
    {
        return [
            'company_user_id' => User::factory()->company(),
            'title' => fake()->jobTitle() . ' Intern',
            'description' => fake()->paragraphs(3, true),
            'requirements' => fake()->paragraph(),
            'location' => fake()->city(),
            'work_mode' => fake()->randomElement(['ONSITE', 'REMOTE', 'HYBRID']),
            'duration_weeks' => fake()->numberBetween(8, 24),
            'quota' => fake()->numberBetween(1, 5),
            'filled_count' => 0, // Should be 0 initially
            'stipend_info' => 'Paid: $' . fake()->numberBetween(500, 2000) . '/month',
            'application_deadline' => fake()->dateTimeBetween('+1 week', '+2 months')->format('Y-m-d'),
            'status' => 'DRAFT',
            'min_gpa' => fake()->randomFloat(2, 2.5, 3.5),
            'preferred_departments' => fake()->randomElement(['Computer Science', 'Information Technology', 'Software Engineering']),
        ];
    }
    
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'PUBLISHED',
            'published_at' => now(),
            'approved_by' => 1, // Usually Admin ID 1
        ]);
    }
}
