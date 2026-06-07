<?php

namespace Database\Factories;

use App\Models\CompanyEvaluation;
use App\Models\Internship;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyEvaluationFactory extends Factory
{
    protected $model = CompanyEvaluation::class;

    public function definition(): array
    {
        return [
            'internship_id' => Internship::factory()->completed(),
            'evaluator_user_id' => User::factory()->company(),
            'composite_score' => fake()->randomFloat(2, 70, 100),
            'strengths' => fake()->paragraph(),
            'improvements' => fake()->paragraph(),
            'overall_comments' => fake()->paragraph(),
            'hiring_recommendation' => fake()->randomElement(['WOULD_HIRE', 'WOULD_CONSIDER', 'WOULD_NOT_HIRE']),
            'status' => 'SUBMITTED',
            'is_late' => 0,
            'submitted_at' => now(),
        ];
    }
}
