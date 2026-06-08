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
            'strengths' => fake()->randomElement([
                "Excellent problem-solving skills and a strong grasp of our tech stack. Very proactive.",
                "Great team player, always willing to help others. Quick learner when introduced to new frameworks.",
                "Strong attention to detail, especially in code reviews and writing test cases.",
                "Consistently delivered high-quality features ahead of schedule. Great communication skills."
            ]),
            'improvements' => fake()->randomElement([
                "Could improve on speaking up more during daily standups.",
                "Needs to spend more time writing documentation for the code produced.",
                "Should focus on understanding the broader system architecture, not just isolated tasks.",
                "Sometimes rushes through tasks; could benefit from more thorough self-testing."
            ]),
            'overall_comments' => fake()->randomElement([
                "Overall, a fantastic intern. We would be thrilled to have them return full-time.",
                "Solid performance throughout the internship. Showed great growth and maturity.",
                "Met all our expectations and contributed significantly to our Q3 deliverables.",
                "A dedicated and hard-working student with a bright future in software engineering."
            ]),
            'hiring_recommendation' => fake()->randomElement(['WOULD_HIRE', 'WOULD_CONSIDER', 'WOULD_NOT_HIRE']),
            'status' => 'SUBMITTED',
            'is_late' => 0,
            'submitted_at' => now(),
        ];
    }
}
