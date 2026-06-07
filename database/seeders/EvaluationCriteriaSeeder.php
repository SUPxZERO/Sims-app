<?php

namespace Database\Seeders;

use App\Models\EvaluationCriteria;
use Illuminate\Database\Seeder;

class EvaluationCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $criterias = [
            [
                'criteria_name' => 'Technical Competence',
                'description' => 'Ability to apply technical skills and knowledge to assigned tasks',
                'weight' => 0.20,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'criteria_name' => 'Communication Skills',
                'description' => 'Effectiveness in verbal and written communication',
                'weight' => 0.15,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'criteria_name' => 'Teamwork & Collaboration',
                'description' => 'Ability to work effectively in teams and collaborate with colleagues',
                'weight' => 0.15,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'criteria_name' => 'Professionalism & Work Ethic',
                'description' => 'Demonstrates responsibility, punctuality, and professional behavior',
                'weight' => 0.15,
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'criteria_name' => 'Initiative & Problem Solving',
                'description' => 'Proactively identifies and resolves problems, shows self-motivation',
                'weight' => 0.15,
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'criteria_name' => 'Attendance & Punctuality',
                'description' => 'Regularity of attendance and adherence to work schedules',
                'weight' => 0.10,
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'criteria_name' => 'Overall Performance',
                'description' => 'General assessment of intern overall contribution and growth',
                'weight' => 0.10,
                'sort_order' => 7,
                'is_active' => true,
            ],
        ];

        foreach ($criterias as $criteria) {
            EvaluationCriteria::updateOrCreate(
                ['criteria_name' => $criteria['criteria_name']],
                $criteria
            );
        }
    }
}
