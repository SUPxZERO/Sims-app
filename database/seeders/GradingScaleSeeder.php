<?php

namespace Database\Seeders;

use App\Models\GradingScale;
use Illuminate\Database\Seeder;

class GradingScaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $scales = [
            ['letter_grade' => 'A',  'min_score' => 85.00, 'max_score' => 100.00, 'grade_point' => 4.00, 'sort_order' => 1],
            ['letter_grade' => 'B+', 'min_score' => 80.00, 'max_score' => 84.99,  'grade_point' => 3.50, 'sort_order' => 2],
            ['letter_grade' => 'B',  'min_score' => 75.00, 'max_score' => 79.99,  'grade_point' => 3.00, 'sort_order' => 3],
            ['letter_grade' => 'C+', 'min_score' => 70.00, 'max_score' => 74.99,  'grade_point' => 2.50, 'sort_order' => 4],
            ['letter_grade' => 'C',  'min_score' => 65.00, 'max_score' => 69.99,  'grade_point' => 2.00, 'sort_order' => 5],
            ['letter_grade' => 'D',  'min_score' => 60.00, 'max_score' => 64.99,  'grade_point' => 1.50, 'sort_order' => 6],
            ['letter_grade' => 'F',  'min_score' => 0.00,  'max_score' => 59.99,  'grade_point' => 0.00, 'sort_order' => 7],
        ];

        foreach ($scales as $scale) {
            GradingScale::updateOrCreate(
                ['letter_grade' => $scale['letter_grade']],
                $scale
            );
        }
    }
}
