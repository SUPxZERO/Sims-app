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
            'comments' => fake()->randomElement([
                "Good progress this week. Make sure to document the specific challenges you faced with the database migration.",
                "Excellent detailed report. It's great to see you applying the concepts we discussed in class.",
                "Please provide more detail on the 'challenges' section next time. What specifically was difficult about the API integration?",
                "Solid work. I'm pleased with your time management and the tasks you completed."
            ]),
            'reviewed_at' => now(),
        ];
    }
}
