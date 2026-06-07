<?php

namespace Database\Factories;

use App\Models\ReportReview;
use App\Models\WeeklyReport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportReviewFactory extends Factory
{
    protected $model = ReportReview::class;

    public function definition(): array
    {
        return [
            'report_id' => WeeklyReport::factory(),
            'reviewer_user_id' => User::factory()->lecturer(),
            'decision' => fake()->randomElement(['APPROVED', 'REVISION_REQUESTED']),
            'comments' => fake()->paragraph(),
            'reviewed_at' => now(),
        ];
    }
}
