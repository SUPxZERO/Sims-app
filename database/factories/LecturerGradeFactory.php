<?php

namespace Database\Factories;

use App\Models\LecturerGrade;
use App\Models\Internship;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LecturerGradeFactory extends Factory
{
    protected $model = LecturerGrade::class;

    public function definition(): array
    {
        $rqs = fake()->randomFloat(2, 70, 100);
        $ps = fake()->randomFloat(2, 70, 100);
        $es = fake()->randomFloat(2, 70, 100);
        
        $comp = ($rqs * 0.4) + ($ps * 0.4) + ($es * 0.2); // Just a dummy weight for factory
        
        return [
            'internship_id' => Internship::factory()->completed(),
            'grader_user_id' => User::factory()->lecturer(),
            'report_quality_score' => $rqs,
            'presentation_score' => $ps,
            'engagement_score' => $es,
            'composite_score' => $comp,
            'overall_comments' => fake()->paragraph(),
            'status' => 'SUBMITTED',
            'submitted_at' => now(),
        ];
    }
}
