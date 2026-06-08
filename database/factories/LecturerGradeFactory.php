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
            'overall_comments' => fake()->randomElement([
                "The student demonstrated excellent application of theoretical knowledge in a practical setting. Weekly reports were thorough and insightful.",
                "Good overall performance. The presentation was well-structured, though the technical depth could have been slightly better explained.",
                "Outstanding engagement throughout the internship. The student showed great initiative and received glowing feedback from the company supervisor.",
                "Satisfactory completion of the internship requirements. Reports were submitted on time but lacked some critical reflection on the challenges faced."
            ]),
            'status' => 'SUBMITTED',
            'submitted_at' => now(),
        ];
    }
}
