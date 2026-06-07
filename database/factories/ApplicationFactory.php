<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\User;
use App\Models\InternshipListing;
use App\Models\CvVersion;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->student(),
            'listing_id' => InternshipListing::factory(),
            'cv_version_id' => CvVersion::factory(),
            'cover_letter' => fake()->paragraph(),
            'match_score_at_apply' => fake()->randomFloat(2, 50, 100),
            'status' => 'SUBMITTED',
            'submitted_at' => now(),
        ];
    }
    
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'CONFIRMED',
            'reviewed_at' => now()->subDays(3),
            'decided_at' => now()->subDays(2),
            'confirmed_at' => now()->subDay(),
        ]);
    }
}
