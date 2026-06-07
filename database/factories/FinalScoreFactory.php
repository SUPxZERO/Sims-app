<?php

namespace Database\Factories;

use App\Models\FinalScore;
use App\Models\Internship;
use Illuminate\Database\Eloquent\Factories\Factory;

class FinalScoreFactory extends Factory
{
    protected $model = FinalScore::class;

    public function definition(): array
    {
        $ces = fake()->randomFloat(2, 70, 100);
        $lgs = fake()->randomFloat(2, 70, 100);
        $as = fake()->randomFloat(2, 80, 100);
        
        $cw = 0.40;
        $lw = 0.40;
        $aw = 0.20;
        
        $comp = ($ces * $cw) + ($lgs * $lw) + ($as * $aw);
        
        $grade = 'F';
        if ($comp >= 85) $grade = 'A';
        elseif ($comp >= 80) $grade = 'B+';
        elseif ($comp >= 70) $grade = 'B';
        elseif ($comp >= 65) $grade = 'C+';
        elseif ($comp >= 55) $grade = 'C';
        elseif ($comp >= 50) $grade = 'D';

        return [
            'internship_id' => Internship::factory()->completed(),
            'company_eval_score' => $ces,
            'lecturer_grade_score' => $lgs,
            'attendance_score' => $as,
            'company_weight' => $cw,
            'lecturer_weight' => $lw,
            'attendance_weight' => $aw,
            'composite_score' => $comp,
            'letter_grade' => $grade,
            'calculated_at' => now(),
            'calculated_by' => 'SYSTEM',
        ];
    }
}
